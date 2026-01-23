import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          data-testid="link-back-home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8" data-testid="text-terms-title">
          Terms of Service
        </h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using MARGIX ("Service," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground mb-3">
              MARGIX provides analytics and monitoring tools that analyze data from third-party delivery platforms (including but not limited to Uber Eats, DoorDash, and Grubhub) to identify potential discrepancies such as pricing inconsistencies, missed refunds, or promotional losses.
            </p>
            <p className="text-muted-foreground">
              MARGIX provides analytics only and does not guarantee the recovery of funds, refunds, credits, or dispute outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. No Affiliation With Third Parties</h2>
            <p className="text-muted-foreground mb-3">
              MARGIX is not affiliated with, endorsed by, sponsored by, or partnered with Uber Eats, DoorDash, Grubhub, or any other third-party platform.
            </p>
            <p className="text-muted-foreground">
              All trademarks and brand names belong to their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. User Responsibilities</h2>
            <p className="text-muted-foreground mb-3">You represent and warrant that:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>You are authorized to access and analyze any accounts you connect</li>
              <li>You comply with all applicable laws and third-party platform terms</li>
              <li>You maintain the security of your credentials</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              MARGIX is not responsible for account actions taken by third-party platforms, including suspensions or terminations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Accuracy & Disclaimer</h2>
            <p className="text-muted-foreground mb-3">
              The Service relies on data provided by third-party platforms. MARGIX does not warrant or guarantee:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Accuracy or completeness of third-party data</li>
              <li>Detection of all discrepancies</li>
              <li>Any financial outcome</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              All outputs are provided "as is" and "as available."
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-3">
              To the maximum extent permitted by Washington law, MARGIX shall not be liable for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Lost revenue, profits, or business opportunities</li>
              <li>Platform penalties or enforcement actions</li>
              <li>Indirect, incidental, consequential, or punitive damages</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              In no event shall MARGIX's total liability exceed the amount paid by you to MARGIX in the three (3) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Indemnification</h2>
            <p className="text-muted-foreground mb-3">
              You agree to indemnify and hold harmless MARGIX from any claims, damages, liabilities, or expenses arising from:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of third-party platform rules</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Suspension & Termination</h2>
            <p className="text-muted-foreground">
              We may suspend or terminate your access at any time, with or without notice, for misuse, violation of these Terms, or legal compliance reasons.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Modifications</h2>
            <p className="text-muted-foreground">
              We may modify these Terms at any time. Continued use of the Service constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Governing Law & Venue</h2>
            <p className="text-muted-foreground mb-3">
              These Terms are governed by the laws of the State of Washington, without regard to conflict-of-law principles.
            </p>
            <p className="text-muted-foreground">
              Any legal action shall be brought exclusively in the state or federal courts located in Washington State, and you consent to their jurisdiction.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
