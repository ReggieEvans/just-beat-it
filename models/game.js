import { Schema, model, models } from 'mongoose';

const GameSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    id: { type: Number },
    name: { type: String },
    summary: { type: String },
    cover: {
      id: { type: Number },
      url: { type: String },
    },
    total_rating: { type: Number },
    total_rating_count: { type: Number },
    first_release_date: { type: Number },
    involved_companies: [
      {
        id: { type: String },
        company: {
          id: { type: String },
          name: { type: String },
        },
      },
    ],
    screenshots: [
      {
        id: { type: String },
        url: { type: String },
      },
    ],
    _userId: { type: String },
    _isInProgress: { type: Boolean, default: false },
    _isQuit: { type: Boolean, default: false },
    _isPileOfShame: { type: Boolean, default: false },
    _isCompleted: { type: Boolean, default: false },
    _gameplayHours: {
      gameplayMain: { type: Number, default: null },
      gameplayMainExtra: { type: Number, default: null },
      gameplayCompletionist: { type: Number, default: null },
    },
  },
  {
    timestamps: true,
  }
);

const Game = models.Game || model('Game', GameSchema);

export default Game;
