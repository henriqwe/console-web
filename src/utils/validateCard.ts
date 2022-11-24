const cardsBrands = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard:
    /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
  diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  amex: /^3[47][0-9]{13}$/,
  discover:
    /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
  hipercard: /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
  elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/,
  jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
  aura: /^(5078\d{2})(\d{2})(\d{11})$/
}

export function getCardBrand(cardnumber: string) {
  cardnumber = cardnumber.replace(/[^0-9]+/g, '')

  for (const brand in cardsBrands) {
    if (cardsBrands[brand].test(cardnumber)) {
      return brand
    }
  }

  return false
}

export function checkLuhn(value: string) {
  // remove all non digit characters
  value = value.replace(/\D/g, '')
  let sum = 0
  let shouldDouble = false
  // loop through values starting at the rightmost side
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value.charAt(i))

    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9
    }

    sum += digit
    shouldDouble = !shouldDouble
  }
  return sum % 10 == 0
}

export function validateCVV({
  creditCard,
  cvv
}: {
  creditCard: string
  cvv: string
}) {
  // remove all non digit characters
  var creditCard = creditCard.replace(/\D/g, '')
  var cvv = cvv.replace(/\D/g, '')
  // american express and cvv is 4 digits
  if (cardsBrands.amex.test(creditCard)) {
    if (/^\d{4}$/.test(cvv)) return true
  } else if (/^\d{3}$/.test(cvv)) {
    // other card & cvv is 3 digits
    return true
  }
  return false
}

export function formatCardNumber(value: string) {
  if (!value) {
    return ''
  }

  // remove all non digit characters
  value = value.replace(/\D/g, '')

  // american express, 15 digits
  if (/^3[47]\d{0,13}$/.test(value)) {
    return value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
  }

  // diner's club, 14 digits
  if (/^3(?:0[0-5]|[68]\d)\d{0,11}$/.test(value)) {
    return value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{6})/, '$1 $2 ')
  }

  // regular cc number, 16 digits
  if (/^\d{0,16}$/.test(value)) {
    return value
      .replace(/(\d{4})/, '$1 ')
      .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
      .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
  }

  return ''
}

export function handleBrandName(brandName: string, reverse?: boolean) {
  if (!brandName) {
    return ''
  }

  if (reverse) {
    switch (brandName) {
      case 'Visa':
        return 'visa'
      case 'Mastercard':
        return 'mastercard'
      case 'Diners':
        return 'diners'
      case 'Amex':
        return 'amex'
      case 'Discover':
        return 'discover'
      case 'Hipercard':
        return 'hipercard'
      case 'Elo':
        return 'elo'
      case 'JCB':
        return 'jcb'
      case 'Aura':
        return 'aura'
      default:
        return ''
    }
  }
  switch (brandName) {
    case 'visa':
      return 'Visa'
    case 'mastercard':
      return 'Mastercard'
    case 'diners':
      return 'Diners'
    case 'amex':
      return 'Amex'
    case 'discover':
      return 'Discover'
    case 'hipercard':
      return 'Hipercard'
    case 'elo':
      return 'Elo'
    case 'jcb':
      return 'JCB'
    case 'aura':
      return 'Aura'
    default:
      return ''
  }
}
