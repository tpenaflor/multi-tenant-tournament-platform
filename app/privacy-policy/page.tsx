import React from 'react';

export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex-1 bg-slate-950 text-slate-300 py-12 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-8 bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">
        <h1 className="text-4xl font-bold text-white mb-6">Privacy Policy</h1>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
          <p>
            When you use our services (including signing in via Google), we may collect your email address, name, and basic profile information. We do not access sensitive personal data without your explicit consent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
          <p>
            The information we collect is used solely to provide and improve our platform, manage your tournament participations, and facilitate communication between you and tournament organizers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties, except for trusted third parties who assist us in operating our website and conducting our business, so long as those parties agree to keep this information confidential.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">4. Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet, or method of electronic storage, is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">5. Changes to our Privacy Policy</h2>
          <p>
            If we decide to change our privacy policy, we will post those changes on this page. This policy was last modified on August 6, 2026.
          </p>
        </section>
      </div>
    </main>
  );
}
