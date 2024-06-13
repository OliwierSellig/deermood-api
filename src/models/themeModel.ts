import mongoose from 'mongoose';

interface ITheme extends Document {
  subtitle: string;
  title: string;
  description: string;
  buttonContent: string;
  buttonUrl: string;
  image: string;
}

const themeSchema = new mongoose.Schema<ITheme>({
  subtitle: { type: String, required: [true, 'Theme must have a subtitle'] },
  title: { type: String, required: [true, 'Theme must have a title'] },
  description: {
    type: String,
    required: [true, 'Theme must have a description'],
  },
  buttonContent: {
    type: String,
    required: [true, 'Theme Button must have a content'],
  },
  buttonUrl: {
    type: String,
    required: [true, 'Theme Button must have an URL'],
  },
  image: String,
});

const Theme = mongoose.model('Theme', themeSchema);

export default Theme;
