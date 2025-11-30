import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose' // needed for /test-db
import connectDB from './config/mongodb.js'
import connectCloudinary, { cloudinary } from './config/cloudinary.js' // FIX: import default
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// app config
const app = express()
const port = process.env.PORT || 3000

// Connect to database (CALL THE FUNCTION)
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use("/api/user", userRouter)


app.get("/", (req, res) => {
  res.send("API Working")
});

app.get('/test-db', (req, res) => {
  const state = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (state === 1) {
    res.send('Database is connected');
  } else {
    res.status(500).send('Database is NOT connected');
  }
});

app.get('/test-cloudinary', async (req, res) => {
  try {
    const cfg = cloudinary.config();
    if (!cfg.api_key) return res.status(500).json({ ok: false, msg: 'No api_key in config' });
    // tiny 1x1 PNG
    const dataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg==';
    const result = await cloudinary.uploader.upload(dataUri);
    res.json({ ok: true, public_id: result.public_id });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Start HTTP server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
