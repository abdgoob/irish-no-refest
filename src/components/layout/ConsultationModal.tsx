"use client";

export function ConsultationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="sd-modal theme-light" role="dialog" aria-modal="true" aria-label="Reserve a table">
      <div className="sd-modal__inner">
        <button
          type="button"
          onClick={onClose}
          className="p5"
          style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", marginBottom: "2rem" }}
        >
          Close
        </button>
        <h2 className="h4">Reserve a table</h2>
        <form
          className="theme-light"
          style={{ marginTop: "2rem", maxWidth: "480px" }}
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          <label className="p6" htmlFor="consult-name">
            Name
          </label>
          <input id="consult-name" name="Name" type="text" className="sd-input" required />
          <label className="p6" htmlFor="consult-phone" style={{ display: "block", marginTop: "1.5rem" }}>
            Phone
          </label>
          <input id="consult-phone" name="Phone" type="tel" className="sd-input" required />
          <p className="p6" style={{ marginTop: "1.5rem", textTransform: "none", letterSpacing: "0.02em" }}>
            By sending this form you acknowledge the privacy policy.
          </p>
          <div style={{ marginTop: "2rem" }}>
            <button type="submit" className="sd-btn-pill p5">
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
