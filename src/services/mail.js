import nodemailer from "nodemailer"


export const mail =async({to,subject,html} = {})=>{

    const transporter = nodemailer.createTransport({
        service:"gmail",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});


  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `" 👻" <${process.env.EMAIL}>`, // sender address
    to, // list of receivers
    subject: subject ? subject : "Activate email", // Subject line
    text: "Hello ✔", // plain text body
    html: html ? html : "<b>Hello world?</b>", // html body
});
if(info.rejected.length>0){
  return new Error("Invalid email info")
}
}


