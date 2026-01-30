import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          data-testid="link-back-home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-8" data-testid="text-privacy-title">
          Privacy Policy
        </h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-foreground mb-2">a. Information You Provide</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
              <li>Name, email, business details</li>
              <li>Authorized access to delivery platform data</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mb-2">b. Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Usage data and log files</li>
              <li>Device and browser information</li>
              <li>Analytics and performance metrics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Information</h2>
            <p className="text-muted-foreground mb-3">We use collected information to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide and improve the Service</li>
              <li>Analyze transaction data</li>
              <li>Detect discrepancies and losses</li>
              <li>Communicate with users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Third-Party Platforms</h2>
            <p className="text-muted-foreground">
              MARGIX accesses third-party platform data only with user authorization. We do not control how those platforms collect, store, or process data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Sharing</h2>
            <p className="text-muted-foreground mb-3">We do not sell personal information.</p>
            <p className="text-muted-foreground mb-3">We may share information:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>With service providers necessary to operate the Service</li>
              <li>To comply with legal obligations</li>
              <li>To protect against fraud, abuse, or security risks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Security</h2>
            <p className="text-muted-foreground mb-3">
              We use reasonable administrative, technical, and organizational safeguards.
            </p>
            <p className="text-muted-foreground">
              However, no system can be guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain data only as long as reasonably necessary to provide the Service or comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Washington Privacy Rights</h2>
            <p className="text-muted-foreground mb-3">
              Washington residents may have rights under applicable state law to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Request access to personal data</li>
              <li>Request deletion or correction</li>
              <li>Withdraw consent where applicable</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Requests may be sent to: privacy@margix.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Children's Privacy</h2>
            <p className="text-muted-foreground">
              MARGIX is not intended for individuals under 18, and we do not knowingly collect personal data from minors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. Continued use of the Service constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
