import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy — CineBuffs",
    description: "Learn how CineBuffs collects, uses, and protects your personal information.",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: "2.5rem" }}>
        <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
            fontWeight: 600,
            color: "var(--color-text-main)",
            marginBottom: "0.75rem",
            paddingBottom: "0.5rem",
            borderBottom: "1px solid var(--color-border)",
        }}>
            {title}
        </h2>
        <div style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            lineHeight: "1.8",
            color: "var(--color-text-muted)",
        }}>
            {children}
        </div>
    </div>
);

export default function PrivacyPolicyPage() {
    return (
        <main className="page-container" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>

            {/* Page Header */}
            <div style={{ marginBottom: "3rem", borderBottom: "4px solid var(--color-brand)", paddingBottom: "1.5rem" }}>
                <p style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--color-brand)",
                    marginBottom: "0.75rem",
                }}>
                    Legal
                </p>
                <h1 style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: 700,
                    color: "var(--color-text-main)",
                    lineHeight: 1.15,
                    marginBottom: "0.75rem",
                }}>
                    Privacy Policy
                </h1>
                <p style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                }}>
                    Last updated: November 2026
                </p>
            </div>

            {/* Content */}
            <div style={{ maxWidth: "760px" }}>

                <Section title="1. Introduction">
                    <p>
                        Welcome to CineBuffs (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We operate the website{" "}
                        <a href="https://cinebuffs.org" style={{ color: "var(--color-brand)" }}>cinebuffs.org</a>,
                        a platform for high-quality movie, series, and blog reviews by passionate cinephiles.
                    </p>
                    <p style={{ marginTop: "0.75rem" }}>
                        This Privacy Policy explains what personal information we collect when you use our website,
                        how we use it, and what rights you have regarding your data. By using CineBuffs, you agree
                        to the practices described in this policy.
                    </p>
                </Section>

                <Section title="2. What Data We Collect">
                    <p>We collect the following types of information:</p>
                    <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <li>
                            <strong style={{ color: "var(--color-text-main)" }}>Account Information</strong> — When you sign up,
                            we collect your name, email address, and a hashed (encrypted) version of your password.
                        </li>
                        <li>
                            <strong style={{ color: "var(--color-text-main)" }}>Newsletter Subscription</strong> — If you subscribe
                            to our newsletter, we store your email address.
                        </li>
                        <li>
                            <strong style={{ color: "var(--color-text-main)" }}>User-Generated Content</strong> — Reviews, comments,
                            and images you submit are stored and may be displayed publicly on the site.
                        </li>
                        <li>
                            <strong style={{ color: "var(--color-text-main)" }}>Contact Form</strong> — When you use our contact
                            form, we receive your name, email address, and message.
                        </li>
                        <li>
                            <strong style={{ color: "var(--color-text-main)" }}>Session Data</strong> — We use a single
                            authentication cookie to keep you logged in. This cookie does not track your activity
                            across other websites.
                        </li>
                    </ul>
                </Section>

                <Section title="3. How We Use Your Data">
                    <p>We use the information we collect to:</p>
                    <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <li>Create and manage your account</li>
                        <li>Authenticate you when you log in</li>
                        <li>Publish your reviews and comments on the platform</li>
                        <li>Send newsletter emails (only if you subscribed)</li>
                        <li>Respond to your contact form messages</li>
                        <li>Improve and maintain the website</li>
                    </ul>
                    <p style={{ marginTop: "0.75rem" }}>
                        We do not use your data for advertising, profiling, or any purpose beyond operating
                        and improving CineBuffs.
                    </p>
                </Section>

                <Section title="4. Cookies">
                    <p>
                        CineBuffs uses only one cookie: a secure, httpOnly authentication cookie that keeps
                        you logged in during your session. This cookie:
                    </p>
                    <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <li>Is set only when you log in</li>
                        <li>Does not track your browsing activity on other websites</li>
                        <li>Is automatically removed when you log out</li>
                    </ul>
                    <p style={{ marginTop: "0.75rem" }}>
                        We do not use any third-party tracking, advertising, or analytics cookies.
                    </p>
                </Section>

                <Section title="5. Data Sharing">
                    <p>
                        We do not sell, trade, or share your personal information with third parties,
                        except in the following limited cases:
                    </p>
                    <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <li>
                            <strong style={{ color: "var(--color-text-main)" }}>Hosting Provider</strong> — Our website is hosted
                            on Vercel. As our infrastructure provider, Vercel may technically have access to data
                            stored on their servers, subject to their own{" "}
                            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-brand)" }}>
                                privacy policy
                            </a>.
                        </li>
                        <li>
                            <strong style={{ color: "var(--color-text-main)" }}>Legal Requirements</strong> — We may disclose
                            your information if required by law or to protect the rights and safety of our users.
                        </li>
                    </ul>
                </Section>

                <Section title="6. Data Retention">
                    <p>
                        We retain your personal data for as long as your account is active or as needed to
                        provide our services. Specifically:
                    </p>
                    <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <li>Account data is retained until you request account deletion</li>
                        <li>Newsletter subscriptions are retained until you unsubscribe</li>
                        <li>Published reviews and comments may remain visible even after account deletion, in an anonymised form</li>
                    </ul>
                </Section>

                <Section title="7. Your Rights">
                    <p>You have the right to:</p>
                    <ul style={{ paddingLeft: "1.25rem", marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <li><strong style={{ color: "var(--color-text-main)" }}>Access</strong> — Request a copy of the personal data we hold about you</li>
                        <li><strong style={{ color: "var(--color-text-main)" }}>Correction</strong> — Ask us to correct inaccurate or incomplete data</li>
                        <li><strong style={{ color: "var(--color-text-main)" }}>Deletion</strong> — Request that we delete your personal data</li>
                        <li><strong style={{ color: "var(--color-text-main)" }}>Unsubscribe</strong> — Opt out of newsletter emails at any time</li>
                    </ul>
                    <p style={{ marginTop: "0.75rem" }}>
                        To exercise any of these rights, please reach out to us via our{" "}
                        <Link href="/contact" style={{ color: "var(--color-brand)" }}>Contact page</Link>.
                    </p>
                </Section>

                <Section title="8. Children's Privacy">
                    <p>
                        CineBuffs is not directed at children under the age of 13. We do not knowingly
                        collect personal information from children. If you believe a child has provided us
                        with their personal data, please contact us and we will promptly delete it.
                    </p>
                </Section>

                <Section title="9. Changes to This Policy">
                    <p>
                        We may update this Privacy Policy from time to time. When we do, we will update
                        the &ldquo;Last updated&rdquo; date at the top of this page. We encourage you to review
                        this policy periodically. Continued use of CineBuffs after any changes constitutes
                        your acceptance of the updated policy.
                    </p>
                </Section>

                <Section title="10. Contact Us">
                    <p>
                        If you have any questions or concerns about this Privacy Policy or how we handle
                        your data, please contact us through our{" "}
                        <Link href="/contact" style={{ color: "var(--color-brand)" }}>Contact page</Link>.
                    </p>
                </Section>

            </div>
        </main>
    );
}
