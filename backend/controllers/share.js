const nodemailer = require("nodemailer");

const sendMail = async (req, res) => {
  try {
    const { email, name, id } = req.body;
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.Email_User,
        pass: process.env.Email_Pass,
      },
    });

    const msg = {
      from: '"DrawHub" <talibbkhann555@gmail.com>', // sender address
      to: `${email}`, // list of receivers
      subject: `Invitation from ${name} to join`, // Subject line
      text: `We are excited to inform you that you have been invited to collaborate on a document hosted by ${name}.

      Meeting Room ID: ${id}
      Link: http://localhost:3000/
      Best regards,
      DrawHub
        `, // plain text body
    };
    // send mail with defined transport object
    const info = await transporter.sendMail(msg);

    res.status(200).json({ msg: "Email sent!" });
  } catch (error) {
    res.status(500).json({ msg: "INTERNAL SERVER ERROR" });
  }
};

module.exports = { sendMail };
