import React from 'react';

export const metadata = {
  title: 'Terms of Service',
};

export default function TermsOfServicePage() {
  return (
    <main className="flex-1 bg-slate-950 text-slate-300 py-12 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-8 bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800">
        <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">2. Description of Service</h2>
          <p>
            We provide a multi-tenant bracket sports platform allowing users to organize, manage, and participate in sports tournaments.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">3. User Conduct</h2>
          <p>
            You agree to use our services only for lawful purposes. You are solely responsible for the knowledge of and adherence to any and all laws, rules, and regulations pertaining to your use of the services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">4. Account Registration</h2>
          <p>
            You may be required to register with Google or another provider to access certain features. You agree to maintain the confidentiality of your account information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">5. Termination</h2>
          <p>
            We reserve the right to terminate or suspend access to our platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>
      </div>
    </main>
  );
}
