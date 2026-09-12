import { SectionShell } from "@/components/layout/SectionShell";

export function FinanceSection() {
  return (
    <SectionShell id="finance" theme="dark" className="sd-finance">
      <div className="sd-finance__intro">
        <p className="p3">FINANCIAL INDICATORS</p>
        <h2 className="h2 sd-finance__heading">
          A MODEL BUILT
          <br />
          ON CERTAINTY
        </h2>
      </div>

      <div className="sd-finance__rows">
        <div className="sd-finance__row">
          <p className="p5 sd-finance__label">Dividend payments begin</p>
          <p className="h3 sd-finance__value">Q4 2028</p>
        </div>
        <div className="sd-finance__row sd-finance__row--offset">
          <p className="p5 sd-finance__label">Guaranteed annual return</p>
          <p className="h1 sd-finance__value">10%</p>
        </div>
        <div className="sd-finance__row">
          <p className="p5 sd-finance__label">
            Capitalization — increase in the value of an asset following its
            commissioning
          </p>
          <p className="h1 sd-finance__value">up to 30%</p>
        </div>
        <div className="sd-finance__row sd-finance__row--split">
          <div>
            <p className="p5 sd-finance__label">Installment plan</p>
            <p className="h3 sd-finance__value">Up to 2 years</p>
          </div>
          <div>
            <p className="p5 sd-finance__label">Down payment</p>
            <p className="h3 sd-finance__value">From 30%</p>
          </div>
        </div>
      </div>

      <div className="sd-finance__forecast">
        <h3 className="h4 sd-finance__forecast-title">OUR FORECAST</h3>
        <div className="sd-finance__forecast-grid">
          <div>
            <p className="p5 sd-finance__label">Estimated payback period</p>
            <p className="h2 sd-finance__value">≈7 years</p>
          </div>
          <div>
            <p className="p5 sd-finance__label">Average annual occupancy</p>
            <p className="h2 sd-finance__value">≈65%</p>
          </div>
        </div>
      </div>

      <div className="sd-finance__extra">
        <h3 className="h4 sd-finance__forecast-title">ADDITIONAL BENEFITS</h3>
        <ul className="sd-finance__list p4">
          <li>30 days of complimentary accommodation per year</li>
          <li>
            The complex operates year-round, thus ensuring stable occupancy and
            returns
          </li>
          <li>
            Our in-house management company, SD Management, handles your
            apartment professionally without any hassle
          </li>
        </ul>
      </div>
    </SectionShell>
  );
}
