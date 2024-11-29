<template>
  <q-page class="privacy-page">
    <div class="content">
      <h1 class="title">Privacy Policy</h1>

      <section>
        <!-- <h2>What Should I Do?</h2> -->
        <p>
          What Should I Do? ("WSID," "we," "us," or "our") takes the private
          nature of your information very seriously.
        </p>
      </section>

      <section>
        <h2>Account Information</h2>
        <p>
          When you create an account on the Services (an <b>"Account"</b>),
          we’ll ask you for information such as your username, password, age,
          and email address (<b>“Account Information”</b>). We may use Account
          Information, alone or together with other information, to enhance and
          improve the Services, such as by personalization. We use your age to
          verify that you can lawfully use the Services. We use your email
          address to verify your Account and to communicate with you, as
          described in more detail below.
        </p>
      </section>

      <section>
        <h2>Email Communications with Us</h2>
        <p>
          As part of the Services, you may occasionally receive email and other
          communications from us. Administrative communications relating to your
          Account (e.g., for purposes of Account recovery or password reset) are
          considered part of the Services and your Account, which you may not be
          able to opt-out from receiving. We also may send you other kinds of
          emails, which you can opt-out of either from your Account Settings
          page or by using the “Opt-Out” link in the emails themselves.
          <b
            >Note that we will never email you to ask for your password or other
            Account Information</b
          >
        </p>
      </section>

      <section>
        <h2>User Content</h2>
        <p>
          By default, all sharing through the Services is public, and when you
          provide us with content it is published so that anyone can view it.
          Although we do provide tools, like password-protected blogs, Asks, and
          Fan Mail, that let you publish content privately, you should assume
          that anything you publish is publicly accessible unless you have
          explicitly selected otherwise. Also, please keep in mind that anything
          you share privately with another user, particularly through an Ask,
          Fan Mail, or submitted post, may be posted publicly by that user.
          Content published and shared publicly is accessible to everyone,
          including search engines, and you may lose any privacy rights you
          might have regarding that content. In addition, information shared
          publicly may be copied and shared throughout the Internet, including
          through actions or features native to the Services
        </p>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>Provide, maintain, and improve the Services;</li>
          <li>Research and develop new services;</li>
          <li>
            Help protect the safety of WSID and our users, which includes
            blocking suspected spammers, addressing abuse, and enforcing the
            WSID user agreement and our other policies;
          </li>
          <li>
            Send you technical notices, updates, security alerts, invoices and
            other support and administrative messages;
          </li>
          <li>Provide customer service;</li>
          <li>
            Communicate with you about products, services, offers, promotions,
            and events, and provide other news and information we think will be
            of interest to you (for information about how to opt out of these
            communications, see “Your Choices” below);
          </li>
          <li>
            Monitor and analyze trends, usage, and activities in connection with
            our Services;
          </li>
          <li>
            Personalize the Services and provide advertisements, content and
            features that match user profiles or interest.
          </li>
        </ul>
      </section>

      <section>
        <h2>Third-Party Links</h2>
        <p>
          WSID may contain links to other sites. Please be aware that we are not
          responsible for the content or privacy practices of such other sites.
          We encourage our users to be aware when they leave our site and to
          read the privacy statements of any other site that collects personally
          identifiable information.
        </p>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          We take precautions to protect your information. When you submit
          sensitive information via the website, your information is protected
          both online and offline.
        </p>
        <p>
          Wherever we collect sensitive information, that information is
          encrypted and transmitted to us in a secure way. You can verify this
          by looking for a lock icon in the address bar and looking for "https"
          at the beginning of the address of the Web page.
        </p>
        <p>
          While we use encryption to protect sensitive information transmitted
          online, we also protect your information offline. Only employees who
          need the information to perform a specific job (for example,
          administrators or customer service) are granted access to personally
          identifiable information. The computers/servers in which we store
          personally identifiable information are kept in a secure environment.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          If you feel that we are not abiding by this privacy policy, you should
          contact us via email at
          <a href="mailto:hello@wsid.com">hello@wsid.com</a>.
        </p>
      </section>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PrivacyPolicy",
};
</script>

<style lang="scss" scoped>
.privacy-page {
  background-color: #f9fafc;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 32px;

  .content {
    background: #ffffff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    max-width: 900px;
    width: 100%;
    padding: 32px;
    line-height: 28px;
    color: #333;

    .title {
      font-size: 36px;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 32px;
      text-align: center;
      line-height: 48px;
    }

    h2 {
      font-size: 24px;
      color: #2d3748;
      margin-top: 24px;
      margin-bottom: 12px;
      border-left: 4px solid #3182ce;
      padding-left: 12px;
      line-height: 48px;
      font-weight: 600;
    }

    p,
    li {
      font-size: 16px;
      color: #4a5568;
      margin-bottom: 16px;
      text-align: justify;
    }

    ul {
      padding-left: 40px;
      list-style-type: disc;
    }

    section {
      margin-bottom: 24px;
    }

    a {
      color: #3182ce;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    // Responsive Styles
    @media (max-width: 1024px) {
      padding: 24px;

      .title {
        font-size: 32px;
      }

      h2 {
        font-size: 24px;
      }

      p,
      li {
        font-size: 15px;
      }
    }

    @media (max-width: 768px) {
      padding: 16px;

      .title {
        font-size: 28px;
      }

      h2 {
        font-size: 20px;
      }

      p,
      li {
        font-size: 14px;
      }
    }

    @media (max-width: 480px) {
      padding: 12px;

      .title {
        font-size: 24px;
      }

      h2 {
        font-size: 18px;
        padding-left: 8px;
      }

      p,
      li {
        font-size: 13px;
      }
    }
  }
}
</style>
