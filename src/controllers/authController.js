import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
/* import crypto from "crypto";
 */
export const register = async (req, res) => {
  try {
    const { name, surname, username, email, password } = req.body;

    const existed = await User.findOne({ email });
    if (existed)
      return res.status(400).json({ message: "Bu email artıq mövcuddur" });

    const existedUsername = await User.findOne({ username });
    if (existedUsername)
      return res
        .status(400)
        .json({ message: "Bu istifadəçi adı artıq mövcuddur" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      surname,
      username,
      email,
      password: hashedPassword,
    //   emailVerifyToken: null,
      isVerified: false,
    });

/*     const verifyToken = jwt.sign(
      { userId: newUser._id },
      process.env.EMAIL_SECRET,
      { expiresIn: "15m" },
    ); */

/*     const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
 */
 /*    await sendEmail(
      newUser.email,
      "Email ünvanınızı təsdiqləyin",
      `
      <div style="font-family: Arial; background:#f3f4f6; padding:40px;">
        <div style="max-width:520px; margin:0 auto; background:#fff; padding:32px; text-align:center; border-radius:12px;">
          <h2>Email ünvanınızı təsdiqləyin</h2>
          <p>Emailinizi təsdiqləmək üçün aşağıdakı düyməyə klik edin:</p>
          <a href="${verifyLink}" style="display:inline-block; padding:12px 24px; background:#16a34a; color:#fff; border-radius:8px; text-decoration:none;">
            Emaili təsdiqlə
          </a>
          <p style="margin-top:16px; font-size:12px; color:#9ca3af;">
            Bu link 15 dəqiqədən sonra etibarsız olacaq.
          </p>
        </div>
      </div>
      `,
    ); */

    res.status(201).json({
      message: "Qeydiyyat tamamlandı! ",
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Server xətası baş verdi" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Hesab tapılmadı. Zəhmət olmasa emaili yoxlayın" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Emailinizi təsdiqləyin ki, daxil ola biləsiniz" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Şifrə səhvdir. Yenidən cəhd edin" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Uğurlu giriş!",
      token,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const payload = jwt.verify(token, process.env.EMAIL_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(400).json({ message: "İstifadəçi tapılmadı" });
    user.isVerified = true;
    await user.save();
    res.json({ message: "Email uğurla təsdiqləndi" });
  } catch (error) {
    res.status(400).json({ message: "Token etibarsız və ya müddəti bitib" });
  }
}; */

/* export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Bu email ilə hesab tapılmadı" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Şifrə sıfırlama tələbi",
      `<p>Şifrənizi sıfırlamaq üçün aşağıdakı linkə klik edin:</p>
   <a href="${resetLink}">Şifrəni Sıfırla</a>`,
    );
    res.json({ message: "Şifrə sıfırlama linki emailinizə göndərildi" });
  } catch (error) {
    console.error("❌ Password reset request error:", error);
    res.status(500).json({ message: "Server xətası baş verdi" });
  }
}; */

/* export const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  try {
    if (!newPassword) {
      return res.status(400).json({ message: "Yeni şifrə tələb olunur" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Yeni şifrə ilə təsdiq şifrəsi eyni deyil" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Etibarsız və ya müddəti bitmiş token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Şifrə uğurla sıfırlandı" });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({ message: "Server xətası baş verdi" });
  }
}; */

/* export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server xətası baş verdi" });
  }
}; */

/* export const updateProfile = async (req, res) => {
  try {
    const id = req.user.id;
    
    const user = await User.findById(id);

    const {name, surname, username} = req.body;

    if(!user) {
      return res.statu(404).json({message: "İstifadəçi mövcud deyil"})
    }

    if(name) user.name = name;
    if(surname) user.surname = surname;
    if(username) user.username = username;

    await user.save();

    res.json({
      message: "Profil yeniləndi",
      user
    })

  } catch (error) {
    res.status(500).json({ message: "Server xətası baş verdi" });
  }
}; */

/* export const changePassword = async (req,res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if(!user) {
      return res.status(404).json({message: "İstifadəçi mövcud deyil"});
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if(!isMatch) {
      return res.status(400).json({message: "Cari şifrə düzgün deyil"})
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({message: "Şifrə uğurla yeniləndi"})

  } catch (error) {
    res.status(500).json({ message: "Server xətası baş verdi" });
  }
} */