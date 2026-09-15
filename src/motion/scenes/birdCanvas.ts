export type BirdLayer = {
  type: "video";
  sources: { src: string; type: string }[];
  loop: boolean;
  config: Record<string, unknown>;
};

const vertexSource = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// Match the reference's 100 × 100 grid and brightness-driven vertical strokes.
const fragmentSource = `
precision mediump float;
varying vec2 uv;
uniform sampler2D video;
uniform vec2 resolution;
uniform vec2 sourceSize;
uniform vec4 bounds;
uniform vec2 levels;
void main() {
  vec2 pixel = vec2(uv.x, 1.0 - uv.y) * resolution;
  vec2 local = (pixel - bounds.xy) / bounds.zw;
  if (local.x < 0.0 || local.x > 1.0 || local.y < 0.0 || local.y > 1.0) discard;
  vec2 sampleUV = (floor(local * 100.0) + 0.5) / 100.0;
  vec4 color = texture2D(video, sampleUV);
  if (color.a < 0.01 || max(max(color.r, color.g), color.b) < 0.01) discard;
  for (int x = -2; x <= 2; x++) {
    for (int y = -2; y <= 2; y++) {
      vec4 neighbor = texture2D(video, sampleUV + vec2(float(x), float(y)) / sourceSize);
      if (neighbor.a < 0.01 || max(max(neighbor.r, neighbor.g), neighbor.b) < 0.01) discard;
    }
  }
  vec3 adjusted = clamp((color.rgb * 255.0 - levels.x) / (levels.y - levels.x), 0.0, 1.0);
  float brightness = dot(adjusted, vec3(0.333)) * color.a;
  float strokeWidth = (1.0 - brightness) * 1.04 - 0.02;
  bool stroke = abs(fract(local.x * 100.0) - 0.5) < strokeWidth * 0.5;
  vec3 brown = vec3(44.0, 40.0, 36.0) / 255.0;
  vec3 taupe = vec3(168.0, 148.0, 116.0) / 255.0;
  gl_FragColor = vec4(stroke ? brown : taupe, 1.0);
}`;

/** Bird-only canvas with explicit playback and cancellation of pending loads. */
export function createBirdCanvas(canvas: HTMLCanvasElement, layers: BirdLayer[]) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
  if (!gl) return null;
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  };
  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    if (program) gl.deleteProgram(program);
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniforms = Object.fromEntries(
    ["video", "resolution", "sourceSize", "bounds", "levels"]
      .map((name) => [name, gl.getUniformLocation(program, name)]),
  );
  gl.uniform1i(uniforms.video, 0);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

  let disposed = false;
  let playing = false;
  let frame = 0;
  const pendingLoads: Array<() => void> = [];
  const media = layers.map((layer) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.loop = layer.loop;
    video.preload = "auto";
    video.dataset.birdVideo = "";
    video.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none";
    video.setAttribute("aria-hidden", "true");
    video.tabIndex = -1;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const loaded = new Promise<void>((resolve) => {
      const finish = () => {
        clearTimeout(timeout);
        video.removeEventListener("loadeddata", finish);
        video.removeEventListener("error", finish);
        resolve();
      };
      const timeout = window.setTimeout(finish, 8000);
      pendingLoads.push(finish);
      video.addEventListener("loadeddata", finish);
      video.addEventListener("error", finish);
      video.src = layer.sources[0].src;
      document.body.appendChild(video);
      video.load();
    });
    return { video, texture, layer, loaded, lastTime: -1 };
  });

  const length = (value: unknown, axis: number) => {
    if (typeof value === "number") return value;
    const text = String(value);
    const number = parseFloat(text);
    if (text.endsWith("vw")) return number / 100 * window.innerWidth;
    return text.endsWith("%") ? number / 100 * axis : number;
  };
  const draw = () => {
    if (disposed) return;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    gl.uniform2f(uniforms.resolution, width, height);
    for (const item of media) {
      const { video, texture, layer: { config } } = item;
      if (!texture) continue;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      if (video.readyState >= video.HAVE_CURRENT_DATA && item.lastTime !== video.currentTime) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        item.lastTime = video.currentTime;
      }
      // Loop seeks can briefly drop readyState; retain the last decoded frame.
      if (item.lastTime < 0) continue;
      gl.uniform2f(uniforms.sourceSize, video.videoWidth, video.videoHeight);
      gl.uniform4f(uniforms.bounds, length(config.x, width), length(config.y, height),
        length(config.width, width), length(config.height, height));
      gl.uniform2f(uniforms.levels, Number(config.blackPoint), Number(config.whitePoint));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  };
  const tick = () => {
    draw();
    if (playing && !disposed) frame = requestAnimationFrame(tick);
  };
  const resize = new ResizeObserver(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    draw();
  });
  resize.observe(canvas);

  return {
    loaded: Promise.all(media.map((item) => item.loaded)),
    setPlaying(active: boolean) {
      if (disposed || playing === active) return;
      playing = active;
      cancelAnimationFrame(frame);
      media.forEach(({ video }) => {
        if (active) void video.play().catch(() => {});
        else video.pause();
      });
      if (active) tick();
    },
    destroy() {
      disposed = true;
      playing = false;
      cancelAnimationFrame(frame);
      resize.disconnect();
      pendingLoads.forEach((finish) => finish());
      media.forEach(({ video, texture }) => {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.remove();
        gl.deleteTexture(texture);
      });
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
