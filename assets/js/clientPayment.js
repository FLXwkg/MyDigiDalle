const stripe = Stripe("pk_test_51Q2w7GJPwdsJHmhy9LOwp8m7SbZFELdNv4MadeRHTSZNpW2jqZekmEgjLLDP4uuTcBGcte0QISwyyMPPSEVogdWb00GhGjaZBG");

const price = window.location.href.split("/")[4];

const paymentForm = document.getElementById("payment-form");
document.getElementById('price').innerText = `${price}€`
let elements;

console.log('hey')

document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM Loaded")
    const response = await fetch(`/create-payment-intent/${price}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());

    const clientSecret = response.client_secret.toString();
    console.log(clientSecret)
    const options = {
        layout: {
            type: 'accordion',
            defaultCollapsed: false,
            radios: true,
            spacedAccordionItems: false
        }
    }    
    elements = stripe.elements({clientSecret});
    paymentElement = elements.create("payment", options);
    paymentElement.mount("#payment-element");

    paymentForm.dataset.secret = clientSecret;
    console.log(paymentForm.dataset.secret)
})

paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { error } = await stripe.confirmPayment({
        elements: elements,
        confirmParams: {
            return_url: window.location.origin
        }
    });
})