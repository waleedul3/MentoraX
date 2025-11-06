import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  By accessing and using MentoraX ("the Service"), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  MentoraX is an online educational platform that connects learners with mentors and provides access to 
                  courses, learning materials, and educational resources. Our services include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Online courses and educational content</li>
                  <li>Mentorship programs and one-on-one sessions</li>
                  <li>Interactive learning tools and assessments</li>
                  <li>Certification and skill verification</li>
                  <li>Community features and peer interaction</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  To access certain features of the Service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct</h2>
              <div className="space-y-4 text-gray-600">
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit harmful, offensive, or inappropriate content</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of the Service</li>
                  <li>Share account credentials with others</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment and Refunds</h2>
              <div className="space-y-4 text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900">Payment Terms:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All fees are charged in advance and are non-refundable except as required by law</li>
                  <li>Prices are subject to change with 30 days notice</li>
                  <li>Payment processing is handled by secure third-party providers</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-900">Refund Policy:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Course refunds available within 30 days of purchase if less than 20% completed</li>
                  <li>Mentorship session refunds available 24 hours before scheduled time</li>
                  <li>Subscription cancellations take effect at the end of the current billing period</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  The Service and its original content, features, and functionality are owned by MentoraX and are 
                  protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <h3 className="text-lg font-semibold text-gray-900">User Content:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You retain ownership of content you create and submit</li>
                  <li>You grant us a license to use, display, and distribute your content</li>
                  <li>You are responsible for ensuring you have rights to any content you submit</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
                  your information when you use our Service. By using our Service, you agree to the collection 
                  and use of information in accordance with our Privacy Policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers and Limitations</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  The Service is provided "as is" without warranties of any kind. We do not guarantee:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Uninterrupted or error-free service</li>
                  <li>Specific learning outcomes or career advancement</li>
                  <li>Accuracy or completeness of all content</li>
                  <li>Compatibility with all devices or systems</li>
                </ul>
                <p>
                  Our liability is limited to the maximum extent permitted by law. In no event shall MentoraX be 
                  liable for any indirect, incidental, special, or consequential damages.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, 
                  for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                </p>
                <p>
                  You may terminate your account at any time by contacting us. Upon termination, your right to use 
                  the Service will cease immediately.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We reserve the right to modify these terms at any time. We will notify users of any material changes 
                  via email or through the Service. Your continued use of the Service after such modifications constitutes 
                  acceptance of the updated terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                  in which MentoraX operates, without regard to its conflict of law provisions.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> legal@mentorax.com</p>
                  <p><strong>Address:</strong> 123 Education Street, Learning City, LC 12345</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;