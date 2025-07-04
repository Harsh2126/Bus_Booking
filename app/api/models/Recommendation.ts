import { Schema, model, models } from 'mongoose';

const RecommendationSchema = new Schema({
  icon: { type: String, default: '🚌' },
  route: { type: String, required: true },
  desc: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Recommendation = models.Recommendation || model('Recommendation', RecommendationSchema);

export default Recommendation; 