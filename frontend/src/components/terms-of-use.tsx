"use client";
import Topbar from "@/components/shared/topbar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const TermsOfUse = () => {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");

  useEffect(() => {
    if (payment && window) {
      const element = window.document.getElementById("payment-scroll");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }
  }, [payment]);

  return (
    <div>
      <div className="sticky top-[-2px] z-50 bg-white py-2">
        <Topbar />
      </div>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Terms of Use</h1>
        <p className="text-gray-600 mb-4">Effective Date: 05/03/2025</p>
        <p className="text-gray-600 mb-4">Last Updated: 14/02/2025</p>

        <p className="mb-4">
          Aprisio (“Aprisio”, "we," "our," or "us") is owned and operated by Age
          Wise Digital Solutions Private Limited, a company (“Company”)
          incorporated in India under the Companies Act, 2013 and having its
          registered office at Workden, No. 775, 2nd Floor, 100 Feet Road,
          IndiraNagar, Hulsur Bazaar, Bangalore North, Bangalore- 560008,
          Karnataka. By accessing or using our website and mobile application
          (the "App") (collectively the "Platform"), the user (“you” or “your”
          or “user”) agrees to be bound by these Terms of Use ("Terms"). If you
          do not agree to all the Terms, then you may not use any products,
          application or Services (defined below) provided on the Platform.
          These Terms shall be read in conjunction with any other specific terms
          of use or conditions for the use of any of our specific services,
          which are provided below in these Terms.
        </p>

        <p className="mb-4">
          These Terms are an electronic record as per the Information Technology
          Act, 2000 (as amended/re-enacted) and rules thereunder. In addition,
          some of the services may be subject to additional terms specified by
          us from time to time and your use of such services will be subject to
          those additional terms.
        </p>

        <p className="mb-4">
          The Platform’s privacy practices regarding the collection, use and
          safeguard of your information including any personal and sensitive
          personal information are governed by the Company’s Privacy Policy.
          Please read these Terms, along with the Company’s Privacy Policy
          available at{" "}
          <Link href="/privacy-policy" className="text-blue-500 underline">
            www.aprisio.com/privacy-policy
          </Link>{" "}
          as they govern your use of the Platform, and the Services provided
          therein.
        </p>

        <h2 className="text-2xl font-bold mb-4">Eligibility</h2>
        <p className="mb-4">
          Only persons who can form legally binding contracts under the Indian
          Contract Act, 1872 may access the Platform and avail our Services.
          Persons who are ‘incompetent to contract’ within the meaning of the
          Indian Contract Act, 1872, including, without limitation,
          un-discharged insolvents, are not eligible to avail our Services. If
          you are a minor i.e., under the age of 18 (eighteen) years, you cannot
          register and/or avail our Services. We reserve the right to refuse to
          provide you with access to the Services if it is brought to our notice
          or if it is discovered that you are incompetent to contract. You
          represent and warrant to us that you are of legal age to form a
          binding contract and are not a person barred from availing the
          Services under applicable laws.
        </p>
        <p className="mb-4">
          By using the Platform, you represent that you have the legal capacity
          to enter into a binding agreement and acknowledge to have read,
          understood and consented to be governed and bound by these Terms and
          the Privacy Policy.
        </p>

        <h2 className="text-2xl font-bold mb-4">Account Registration</h2>
        <p className="mb-4">
          You can explore the Platform and various features without requiring to
          sign-in. However, to access certain features on the Platform, you must
          create a user account on our Platform for which you must provide
          accurate, current, and complete information. We are not responsible
          for any losses due to incorrect information provided by you.
        </p>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your login
          credentials and for any activity under your account. You hereby agree
          not to transfer your login credentials or grant access to any third
          party and are solely responsible for all activities on your account.
          Use of another user’s account information for availing the Services is
          expressly prohibited.
        </p>
        <p className="mb-4">
          If it is found that the information so supplied on the Platform is
          inaccurate, incomplete, untrue and not current, we have the right to
          suspend or terminate the user’s account and restrict/refuse the use of
          the Platform by such user in future. The users must notify us
          immediately if you become aware of any unauthorized access or use of
          your account or security breaches.
        </p>

        <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
        <p className="mb-4">
          This electronic record is generated by a computer system and does not
          require any physical or digital signature. By clicking “I Agree”, or
          by using and/or by registering or signing up for the Services on our
          Platform or otherwise having access to and/or using the Platform, you
          acknowledge to have read, understood and consented to be governed and
          bound by these Terms and the Privacy Policy. If you do not accept or
          agree to any part of these Terms or the Privacy Policy, please refrain
          from using the Platform or the Services. Subject to the Terms, we
          offer the Services selected by you solely for your benefit and not for
          any third party.
        </p>

        <h2 className="text-2xl font-bold mb-4">Overview of the Services</h2>
        <p className="mb-4">
          Our Platform caters to users transitioning into the post-career or
          retirement phase, and who wants to be part of a community of
          like-minded people providing features which help users become part of
          our Platform’s post-career community. The term “Post Career” refers to
          any person who has voluntarily or involuntarily given up their
          full-time job, employment or profession. The access and sign up to our
          Platform is free, with certain paid features. Our Platform offers the
          following services (collectively the “Services”):
        </p>

        <h3 className="text-xl font-bold mb-2">Platform Services</h3>
        <ul className="list-disc list-inside mb-4">
          <li>
            Community – The Platform provides free access to our community,
            where users can discover and join various communities or
            sub-communities based on their hobbies & interests. Users are
            welcome to join as many communities as they desire and, post
            content, share and like posts within these communities.
          </li>
        </ul>

        <h3 className="text-xl font-bold mb-2">Events & Experiences</h3>
        <ul className="list-disc list-inside mb-4">
          <li>
            Aprisio Curated Events & Experiences - These events and experiences
            offered by us are tailored to user’s preferences and interests and
            range from gourmet culinary tasting, group adventures, creative
            workshops, fitness sessions and more. These events and experiences
            require payment and are exclusively curated by us for registered
            users and are not open to non-users.
          </li>
          <li>
            User Curated Events & Experiences - Users can create their own
            events and activities in line with the theme of a community and
            invite other community members to join these events. These events
            may be either free or paid. The pricing, dates, timing, venue, terms
            & conditions, cancellation and refund policies, etc., of these
            events are determined solely by the users organizing the event. We
            are not responsible or liable for any aspects of these events.
          </li>
        </ul>

        <p className="mb-4">
          You may use the Platform to access the Services in accordance with the
          Terms and Privacy Policy. We may offer to provide you with the
          Services selected by you, solely for your own use, and not for the use
          or benefit of any third party. In case of any discrepancy in the
          Services, you must bring the same to our notice in writing within a
          period of 7 (seven) days from the date of performance of the Services,
          failing which the Services shall be deemed accepted, fulfilled, and
          satisfactorily completed.
        </p>

        <h2 className="text-2xl font-bold mb-4">User Content</h2>
        <p className="mb-4">
          The Platform allows you to post, share, like and engage with content
          ("User Content"). By submitting User Content, you agree:
        </p>

        <h3 className="text-xl font-bold mb-2">Your Responsibilities</h3>
        <ul className="list-disc list-inside mb-4">
          <li>You own or have the necessary rights to post your content.</li>
          <li>
            Your content does not infringe the rights of others or violate any
            laws.
          </li>
          <li>
            You will not use the Platform or the Services in any manner
            inconsistent with these Terms or Privacy Policy.
          </li>
          <li>
            You will not resell or make any commercial use of the Services or
            use the Services in any way that is unlawful, for any unlawful
            purpose, or in a manner that your use harms us, the Platform, or any
            other person or entity, as determined in our sole discretion, or act
            fraudulently or maliciously.
          </li>
        </ul>

        <h3 className="text-xl font-bold mb-2">License to Us</h3>
        <p className="mb-4">
          By posting User Content, you grant us a worldwide, non-exclusive,
          royalty-free license to use, display, modify, and distribute your
          content for the purpose of operating the Platform.
        </p>

        <h3 className="text-xl font-bold mb-2">Prohibited Content</h3>
        <p className="mb-4">
          We are committed to maintaining a safe and respectful Platform.
          Content that is harmful or inappropriate is strictly prohibited. You
          may not post content that:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Is obscene, defamatory, or offensive.</li>
          <li>Is fraudulent, false, misleading, untruthful or inaccurate.</li>
          <li>Promotes violence, hate speech, or illegal activities.</li>
          <li>
            Exploits or endangers children including but not limited to, child
            sexual abuse materials.
          </li>
          <li>
            Promotes or contains sexual content or profanity, including
            pornography or sexually explicit materials.
          </li>
          <li>
            Promotes violence or incites hatred against individuals or groups
            based on race, ethnicity, religion, disability, age, nationality,
            veteran status, sexual orientation, gender identity, caste,
            immigration status, or any other characteristic associated with
            systemic discrimination.
          </li>
          <li>
            Capitalizes on or is insensitive to significant social, cultural, or
            political events, such as natural disasters, public health
            emergencies, or tragedies.
          </li>
          <li>
            Is related to terrorism, including content that promotes terrorist
            acts, incites violence, or celebrates terrorist attacks.
          </li>
          <li>Contains spam, malware, or harmful material.</li>
          <li>
            Infringes or has the tendency or threatens to infringe any
            intellectual property rights including but not limited to patent,
            trademark, trade secret, copyright, design, geographical indication,
            right of publicity, privacy rights and/or any other rights of any
            third person or any entity without any license or permission of such
            party.
          </li>
          <li>Impersonates any third person or an entity.</li>
          <li>
            Breaches or has the tendency to breach the Terms or our Privacy
            Policy.
          </li>
          <li>Harasses or intimidates others.</li>
          <li>
            Circumvents security measures or attempts to access unauthorized
            content.
          </li>
          <li>Engages in automated data scraping or mining.</li>
          <li>Is an advertisement or a solicitation.</li>
        </ul>

        <p className="mb-4">
          We reserve the right to remove or modify content that violates these
          Terms.
        </p>

        <div id="payment-scroll"></div>

        <h2 className="text-2xl font-bold mb-4">Payment and Refunds</h2>
        <p className="mb-4">
          Fees - You hereby agree that certain Services are available to you for
          a fee (“Fees”), which shall be communicated to you on the Platform
          basis your chosen Service, if applicable. The Fees cover all costs,
          charges and any applicable taxes associated with the Service. The Fees
          for the relevant Services under this Clause shall be valid until the
          completion of the period of your selected Service or until cancelled
          or terminated in accordance with these Terms and Privacy Policy:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            All payment of Fees for ‘User Services’, ‘Aprisio Curated Events &
            Experiences’ and ‘Subscriptions’ shall be paid directly through the
            payment mechanism on the Platform. You are responsible for paying
            all Fees in a timely manner as per the mechanism associated with the
            Service availed by you. The payment terms under this Clause are
            subject to a periodic review and revisions at our sole discretion.
            We may modify and revise the payment terms under this Clause and
            such modifications and revisions may be intimated to you as and when
            required.
          </li>
          <li>
            All payment of Fees for ‘User Events & Experiences’ shall be paid
            through the payment mechanism made available by the concerned user
            and you are responsible for paying all Fees in a timely manner.
          </li>
        </ul>

        <h3 className="text-xl font-bold mb-2">Refunds</h3>
        <ul className="list-disc list-inside mb-4">
          <li>
            Any Fees paid towards ‘Aprisio Curated Events & Experience’ are
            non-refundable.
          </li>
          <li>
            Any Fees towards ‘User Events & Experience’ may or may not be
            refundable depending on the terms & conditions of the user offering
            the service. Please verify and confirm the same with the user
            offering the service.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Conditions to Use</h2>
        <p className="mb-4">
          The Services will be provided on a best-efforts basis. We will make
          reasonable efforts and shall endeavour that you are able to use the
          Services without undue disruption, interruption, or delay.
        </p>
        <p className="mb-4">
          Once you create an account on the Platform, you may receive updates,
          promotional materials and other information we may send with regards
          to the Services, or new services we may offer. You may opt out of
          receiving any, or all, of these commercial communications from us by
          raising a support request as provided for on the Platform or following
          the instructions provided in any email and/or text we send. However,
          you will continue to receive important updates with respect to your
          account on the Platform.
        </p>
        <p className="mb-4">
          When you avail the Services, you agree that you are involved in the
          transmission of sensitive and personal information. You agree and
          consent to us collecting, using, storing and processing the above
          stated information, in accordance with our Privacy Policy read along
          with these Terms.
        </p>
        <p className="mb-4">
          We disclaim any responsibility for any harm resulting from anyone’s
          use of, or access to, the Services. If you avail our Services, you are
          responsible for taking precautions as necessary to protect yourself
          and your device(s) from malware, viruses, spyware, trojan horses,
          worms or trap doors, and other such harmful or destructive software.
        </p>

        <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
        <h3 className="text-xl font-bold mb-2">Our Rights</h3>
        <p className="mb-4">
          All content and materials on the Platform (excluding User Content),
          including logos, trademarks, texts, images, sound recordings, design,
          videos and software, are owned by us or our licensors. You may not use
          them without our prior written consent. You undertake to use the
          Services and the Company’s intellectual property only for the purposes
          specified in these Terms. All trademarks, service marks, trade names,
          trade dress, and other forms of intellectual property are proprietary
          to us. No information, code, algorithms, content, or material from the
          Platform or the Services may be copied, reproduced, republished,
          uploaded, posted, transmitted or distributed in any way without our
          express written permission.
        </p>

        <h3 className="text-xl font-bold mb-2">User Feedback</h3>
        <p className="mb-4">
          If you provide suggestions or feedback, you grant us the right to use
          them without restriction or compensation.
        </p>

        <h2 className="text-2xl font-bold mb-4">Moderation and Enforcement</h2>
        <p className="mb-4">We reserve the right to:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Monitor and moderate user activity and content.</li>
          <li>Suspend or terminate accounts for violating these Terms.</li>
          <li>Report illegal activity to law enforcement.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">
          Third-Party Links and Services
        </h2>
        <p className="mb-4">
          The Platform may contain links to third-party websites and or
          applications. You acknowledge that when you access a third-party link
          that leaves the Platform:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            The website or application you access is not controlled by the
            Company and different terms of use and privacy policies may apply.
          </li>
          <li>
            The inclusion of a link does not imply any endorsement by the
            Company of the third-party website and/or application, the website’s
            and/or application’s provider, or the information on the third-party
            website and/or application.
          </li>
          <li>
            If you submit any information or details on any of those websites
            and/or applications, such information is governed by the terms of
            use and privacy policies of such third-party websites and/or
            applications and the Company disclaims all responsibility or
            liability with respect to these terms of use, policies or the
            websites and/or applications.
          </li>
        </ul>
        <p className="mb-4">
          Your interactions with third-party services are at your own risk. You
          are encouraged to carefully read the terms of use and privacy policy,
          of any third-party website and/or application that you visit. The
          Company reserves the right to disable third-party links from the
          Platform, although the Company is under no obligation to do so.
        </p>

        <h2 className="text-2xl font-bold mb-4">Disclaimer of Warranties</h2>
        <p className="mb-4">
          The Platform is provided "as is" and "as available." We disclaim all
          warranties, express or implied, including but not limited to fitness
          for a particular purpose or the accuracy, adequacy, correctness,
          validity, completeness, or suitability for any purpose, of the
          Services and accept no liability or responsibility with respect to
          your reliance on the statements or claims made by us in the course of
          rendering our Services. We further disclaim that are Platform is free
          from non-infringing content and will be uninterrupted or error-free.
        </p>
        <p className="mb-4">
          The users are allowed to create events and offer them to other users.
          Such events are offered in good faith by the users; however, neither
          the Company, nor its subsidiaries, affiliates, officers, employees,
          agents, partners, and licensors, make any warranty that:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>The service will meet your requirements.</li>
          <li>The service will be timely, secure, or error-free.</li>
          <li>
            The results obtained from the use of the service will be accurate or
            reliable.
          </li>
          <li>
            The quality of any products, services, information, or other
            material purchased or obtained by you through the service will meet
            your expectations.
          </li>
        </ul>
        <p className="mb-4">
          Any Third Party Services which may be provided through the Platform by
          the external service providers who are not employees of the Platform
          or the Company. You agree and acknowledge that you are connecting with
          third party service providers at your own risk, and we undertake no
          responsibility or liability with respect to such third-party service
          providers. We do not warrant the validity, accuracy, completeness,
          safety, legality, quality, or applicability of the content, anything
          said or written by, or any advice provided by such third-party service
          providers. You further agree that in no event will we be made a party
          to or have any liability with respect to any dispute between you and
          any third-party service provider. We may terminate the services of any
          third-party service provider at any time and without any liability, at
          our sole discretion.
        </p>
        <p className="mb-4">
          Save to the extent required by law, we have no special relationship
          with or fiduciary duty to you. You acknowledge that we have no control
          over, and no duty to take any action regarding the effects the
          Services may have on you.
        </p>
        <p className="mb-4">
          The Company makes no representation or warranty that the content on
          the Platform is appropriate to be used or accessed outside the
          Republic of India. Any users who use or access the Platform or avail
          the Services from outside the Republic of India, do so at their own
          risk and are responsible for compliance with the laws of such
          jurisdiction.
        </p>

        <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
        <p className="mb-4">
          To the fullest extent permitted by law, we are not liable for:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            Indirect, incidental, punitive, exemplary, or consequential damages.
          </li>
          <li>
            Damages for loss of data, revenue, or profits incurred by you,
            whether in an action in contract or tort, arising from your access
            to, or use of the Platform.
          </li>
        </ul>
        <p className="mb-4">
          In any event, the total liability of the Company and its affiliates to
          you, for any claims arising out of or relating to the use of the
          Platform and/or Services shall not exceed the amount you paid, if any,
          for the specific Service provided. This limitation applies regardless
          of the form of action, whether in contract, tort, or any other legal
          theory.
        </p>

        <h2 className="text-2xl font-bold mb-4">Indemnification</h2>
        <p className="mb-4">
          You agree to indemnify and hold the Company, its officers, directors,
          and employees from and against any losses, damages, costs, expenses
          and claims arising out of (i) your use of the Services; (ii) any
          breach of these Terms or Privacy Policy by you; (iii) any infringement
          of any intellectual property or other rights of the Company or any
          third party or (iv) your breach of any applicable laws.
        </p>

        <h2 className="text-2xl font-bold mb-4">Termination</h2>
        <p className="mb-4">
          We may suspend or terminate your access to the Platform at any time,
          with or without cause or notice, for violating these Terms or the
          Privacy Policy or for other reasons at our discretion. If you wish to
          terminate your account, you may do so by initiating a support request
          by sending us an email from your registered email-id or through such
          other means as provided by us on the Platform.
        </p>
        <p className="mb-4">
          We reserve the right to, at our sole discretion, (a) cease operating
          the Platform or any of the Services at any time without notice, and/or
          (b) terminate these Terms.
        </p>
        <p className="mb-4">
          All provisions of these Terms which by their nature survive
          termination shall survive termination, including, without limitation,
          intellectual property (Clause 8), disclaimer of warranties (Clause
          11), limitation of liability (Clause 12) and indemnification (Clause
          13).
        </p>

        <h2 className="text-2xl font-bold mb-4">
          Governing Law and Dispute Resolution
        </h2>
        <p className="mb-4">
          These Terms are governed by and construed in accordance with the laws
          of India. The courts of Bengaluru, India shall have sole and exclusive
          jurisdiction in respect of all conflicts or disputes arising out of or
          in connection with this Agreement. Use of the Service is not
          authorized in any jurisdiction that does not give effect to all
          provisions of these Terms, including without limitation, this section.
        </p>

        <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
        <p className="mb-4">
          We may update these Terms from time to time. Any changes made to the
          Terms will become effective upon posting. We may also impose limits on
          certain features and services or restrict your access to parts or all
          of the Services without notice or liability. It is your responsibility
          to check these Terms periodically for changes. Your continued use of
          the Platform signifies your acceptance of the updated Terms.
        </p>

        <h2 className="text-2xl font-bold mb-4">Miscellaneous</h2>
        <p className="mb-4">
          If any provision of these Terms and the Privacy Policy is found to be
          unenforceable or invalid, that provision will be limited or eliminated
          to the minimum extent necessary so that these Terms and the Privacy
          Policy will otherwise remain in full force and effect and enforceable.
        </p>
        <p className="mb-4">
          The failure of either party to exercise, in any respect any right
          provided for herein shall not be deemed a waiver of any further rights
          hereunder.
        </p>
        <p className="mb-4">
          Unless otherwise specified in these Terms and the Privacy Policy, all
          notices hereunder will be in writing and will be deemed to have been
          duly given when received or when receipt is electronically confirmed,
          if transmitted by e-mail.
        </p>
        <p className="mb-4">
          In respect of these Terms and your use of these Services, nothing in
          these Terms shall be deemed to grant any rights or benefits to any
          person, other than us and you, or entitle any third party to enforce
          any provision hereof, and it is agreed that we do not intend that any
          provision of these Terms should be enforceable by a third party as per
          any applicable law.
        </p>

        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you wish to raise a query or complaint with us, please contact our
          Grievance Officer (contact details set out below) who shall
          acknowledge your complaint expeditiously. Kindly note that once your
          complaint is received, we shall use our best efforts to redress it
          within a period of 30 (thirty) days from the date of receipt of such
          complaint:
        </p>
        <p className="mb-4">Name: Kaushal Kumar Mishra</p>
        <p className="mb-4">Contact Number: +91-7411522330</p>
        <p className="mb-4">
          Email:{" "}
          <a
            href="mailto:support@aprisio.com"
            className="text-blue-500 underline"
          >
            support@aprisio.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default TermsOfUse;
