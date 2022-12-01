const GmailFactory = require("gmail-js");
const gmail = new GmailFactory.Gmail();

export let emails = [];
let emailString = [];
let recipientsEmails = [];
gmail.observe.on("recipient_change", function (match, recipients) {
  console.log("recipients changed", recipients);
  console.log("match", match);
  emails = recipients.to;
  recipientsEmails = recipients.to;
  //convet recipients.to into , saperated string
  // match.$el[0].querySelector("[aria-label='To']").querySelector("input:hidden ")
  //save value of , saperated string into hidden field

  document.querySelectorAll(".jns-warning").forEach((ele) => {
    const link = ele.querySelector("a");
    if (emails.length > 0 && link.href.includes("https://www.simform.com/")) {
      let email = emails[0];
      const linkUrl = new URL(link.href);
      link.href = linkUrl.origin + linkUrl.pathname + "?utm-email=" + email;
    }
  });
});

let temp;
gmail.observe.on("compose", function (compose, type) {
  if (!temp) {
    clearTimeout(temp);
  }
  temp = setTimeout(() => {
    //add hidden fields- append in aria-label='To'
    compose.$el[0]
      .querySelector("[aria-label='To']")
      .querySelector("input")
      .addEventListener("change", (ele) => {
        console.log("text change");
        //ele.target.parent untill aria-label='To']
        //aria-label='To'].querySelector(input hiddenfield)
        //take value of ele.target.nextElementSibling.innerHTML save into hidden field
        const emailText = ele.target.nextElementSibling.innerHTML.split(" ")[0];

        emailString = [emailText];

        if (recipientsEmails?.length > 0 || emailString?.length > 0) {
          emails = [...recipientsEmails, ...emailString];
        }
        document.querySelectorAll(".jns-warning").forEach((ele) => {
          const link = ele.querySelector("a");
          if (
            emails?.length > 0 &&
            link.href.includes("https://www.simform.com/")
          ) {
            const linkUrl = new URL(link.href);
            link.href =
              linkUrl.origin + linkUrl.pathname + "?utm-email=" + emails;
          }
        });
      });
  }, [1000]);
});

gmail.observe.on("compose_cancelled", function (compose, type) {
  emails = [];
});
function isEmailMessageBody(mutation) {
   return (
     mutation.type === 'childList' &&
     mutation.target.hasAttribute('contentEditable')
   );
 }
 export const forEachUniqueContentEditable = (action) => {
   const uniqueIds = new Set();
   let tempId = 0;
   console.log("emails",emails);
   return (mutations) => {
        //Don't do that'
        document.querySelectorAll("a").forEach((ele) => {
          if (ele.href.includes("simform.com/") && emails?.length > 0) {
            console.log("if email",emails)
            const linkUrl = new URL(ele.href);
            ele.href = linkUrl.origin + linkUrl.pathname + "?utm-email=" + emails.join("&");
          }
        });
     mutations.filter(isEmailMessageBody).forEach((mutation) => {
       if (!uniqueIds.has(mutation.target.id)) {
         const id = mutation.target.id || tempId++;
         uniqueIds.add(id);
         action(mutation);
       }
     });
   };
 };
 