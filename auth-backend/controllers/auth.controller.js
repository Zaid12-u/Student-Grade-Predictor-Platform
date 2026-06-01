import User from '../models/auth.model.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'zaidaziz139@gmail.com',
        pass: 'lwem miqp jyjr iege'
    }
})


transporter.verify((error, success) => {
    if (error) {
        console.log('Email server error:', error.message)
    } else {
        console.log('Email server ready ✅')
    }
})


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}


const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
}


const sendOTPEmail = async (email, username, otp) => {
    const mailOptions = {
        from: `"Student Grade Predictor" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - Student Grade Predictor',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4F46E5">Welcome ${username}!</h2>
                <p>Your OTP verification code is:</p>
                <h1 style="color: #4F46E5; letter-spacing: 8px">${otp}</h1>
                <p style="color: #888">Valid for 5 minutes only.</p>
                <p style="color: #888">If you did not request this, please ignore this email.</p>
            </div>
        `
    }
    return transporter.sendMail(mailOptions)
}


export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        
        const existingUser = await User.findOne({ email })
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        
        const otp = generateOTP()
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)

        
        if (existingUser && !existingUser.isVerified) {
            existingUser.username = username
            existingUser.password = password
            existingUser.otp = otp
            existingUser.otpExpiry = otpExpiry
            await existingUser.save()
        } else {
            await User.create({
                username,
                email,
                password,
                otp,
                otpExpiry,
                isVerified: false
            })
        }

        
        await sendOTPEmail(email, username, otp)

        res.status(201).json({
            message: 'OTP sent to your email',
            email
        })

    } catch (error) {
        console.log('Register error:', error.message)
        res.status(500).json({ message: error.message })
    }
}


export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' })
        }

        
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'OTP expired — please register again' })
        }

        
        user.isVerified = true
        user.otp = null
        user.otpExpiry = null
        await user.save()

        res.status(200).json({
            message: 'Email verified successfully! You can now login.'
        })

    } catch (error) {
        console.log('VerifyOTP error:', error.message)
        res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' })
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.cookie('token', token, cookieOptions)

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {
        console.log('Login error:', error.message)
        res.status(500).json({ message: error.message })
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie('token', cookieOptions)
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
        console.log('Logout error:', error.message)
        res.status(500).json({ message: error.message })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -otp -otpExpiry')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ user })
    } catch (error) {
        console.log('GetMe error:', error.message)
        res.status(500).json({ message: error.message })
    }
}