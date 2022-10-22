import "./css/index.css"
import Imask from "imask"

const ccBg01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBg02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:last-child img")
const background = document.querySelector(".cc")

const securityCode = document.getElementById("security-code")
const expiratitonDate = document.getElementById("expiration-date")
const cardNumber = document.getElementById("card-number")
const cardHolder = document.getElementById("card-holder")

function setCard(type) {
  const colors = {
    visa: {
      background: "url('./bg-visa.svg')",
    },
    mastercard: {
      background: "url('./bg-mastercard.svg')",
    },
    jcb: {
      background: "url('./bg-jcb.svg')",
    },
    elo: {
      background: "url('./bg-elo.svg')",
    },
    default: {
      background: "url('./bg-default.svg')",
    },
  }

  background.style.backgroundImage = colors[type].background
  ccLogo.setAttribute("src", `./cc-${type}.svg`)
}
globalThis.setCard = setCard

const securityCodeMasked = Imask(securityCode, { mask: "0000" })
const cardHolderMasked = Imask(cardHolder, { mask: /[a-zA-Z\s]$/ })
const expiratitonDateMasked = Imask(expiratitonDate, {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: Number(new Date().getUTCFullYear().toString().slice(2)),
      to: Number(new Date().getUTCFullYear().toString().slice(2)) + 10,
    },
  },
})
const cardNumberMasked = Imask(cardNumber, {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^6\d{0,15}/,
      cardtype: "elo",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^1\d{0,15}/,
      cardtype: "jcb",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = dynamicMasked.value + appended
    const foundMask = dynamicMasked.compiledMasks.find((item) => {
      return number.match(item.regex)
    })
    return foundMask
  },
})

const addButton = document.querySelector("form .button")
const modalButton = document.querySelector(".overlay-modal button")
const modal = document.querySelector(".overlay-modal")
const error = document.querySelector(".error")
const arrayInputs = [
  cardNumberMasked,
  cardHolderMasked,
  expiratitonDateMasked,
  securityCodeMasked,
]

function cleanInput() {
  cardHolderMasked.value = ""
  cardNumberMasked.value = ""
  expiratitonDateMasked.value = ""
  securityCodeMasked.value = ""
}
addButton.addEventListener("click", (e) => {
  e.preventDefault()
  if (
    !cardHolderMasked.value ||
    !cardNumberMasked.value ||
    !expiratitonDateMasked.value ||
    !securityCodeMasked.value
  ) {
  } else {
    modal.classList.add("active")
    modal.addEventListener("click", (event) => {
      if (event.currentTarget === event.target) {
        modal.classList.remove("active")
        cleanInput()
      }
    })
  }
  arrayInputs.forEach((item) => {
    if (item.value === "") {
      item.el.input.classList.add("invalid")
      error.classList.add("active")
    } else {
      error.classList.remove("active")
      item.el.input.classList.remove("invalid")
    }
  })
})
modalButton.addEventListener("click", () => {
  modal.classList.remove("active")
  cleanInput()
})

cardHolderMasked.on("accept", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText = cardHolder.value.length
    ? cardHolder.value
    : "FULANO DA SILVA"
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length ? code : "123"
}
cardNumberMasked.on("accept", () => {
  const typeCard = cardNumberMasked.masked.currentMask.cardtype
  setCard(typeCard)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length ? number : "1234 5678 9012 3456"
}

expiratitonDateMasked.on("accept", () => {
  updateExpirationDate(expiratitonDateMasked.unmaskedValue)
})

function updateExpirationDate(date) {
  const ccDate = document.querySelector(".cc-expiration .value")

  if (date.length > 1) {
    ccDate.innerText = date
  } else if (date === "/") {
    ccDate.innerText = "02/32"
  }
}
