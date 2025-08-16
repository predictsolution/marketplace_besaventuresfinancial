// ********************
// Contracts
// ********************
export const BESA_OG_NFTS_ADDRESS =
  '0xeAa9cfA825a67B730c3183BAD884255deB182db5';
export const MARKETPLACE_BETA_ADDRESS =
  '0x049A7E2FAe64a00EedE3D7fb676464DA7f16e4de';

export const EXTERNAL_URL_OG_NFTS =
  'https://res.cloudinary.com/djiqoqrs2/image/upload/v1686376922/BESA_OG_NFTS/besa_gaming_og_';

export const BSC_ADDRESS_LINK = 'https://bscscan.com/address/';

// ********************
// TOAST
// ********************
export const TOAST_CFG = {
  duration: 3000,
};

// Refresh the page
export function reloadWindow() {
  const event = new Event('visibilitychange');
  document.dispatchEvent(event);
}

// Check Inputs
export function verify_email(email: string) {
  const MIN_EMAIL = 1,
    MIN_DOMAIN = 2,
    MIN_TLD = 2;

  var email_valid = true; // For checking the status of the email
  var email_input = email.trim().replaceAll(/\s+/g, ''); // remove blank spaces
  var email_separator1 = email_input.indexOf('@'); // verify @

  const EMAIL_OUT = email_input; // email to return if valid

  if (email_separator1 <= -1) email_valid = false; // if there is no domain mark error

  var email_domain = email_input.substring(email_separator1 + 1); // get domain
  var email_separator2 = email_domain.indexOf('.'); // get second level domain

  if (email_separator2 <= -1 || email_domain.indexOf('@') != -1)
    // if there is no second level domain mark error
    email_valid = false;

  // get third level domain
  var email_tld = email_domain.substring(email_separator2 + 1);
  var email_separator_3level = email_tld.indexOf('.');
  var email_tld_3level = email_tld.substring(email_separator_3level + 1);

  email_input = email_input.substring(0, email_separator1);
  email_domain = email_domain.substring(0, email_separator2);

  if (
    (email_separator_3level != -1 && email_tld_3level.length < MIN_TLD) ||
    email_tld_3level.indexOf('.') != -1 || // Verify if the third level domain is valid ej: .com.ve (valid)
    email_input.length < MIN_EMAIL || // If the email name is empty
    email_domain.length < MIN_DOMAIN || // If the domain is less than 2 characters
    email_tld.length < MIN_TLD // if the tld is less than 2 characters
  )
    email_valid = false;

  if (email_valid) {
    return {
      valid: true,
      message: 'Email valid',
      email: EMAIL_OUT,
    };
  }

  return {
    valid: false,
    message: 'Enter a valid email',
  };
}

// ********************
// CFG
// ********************
export const NFTS_PER_PAGE = 12;
