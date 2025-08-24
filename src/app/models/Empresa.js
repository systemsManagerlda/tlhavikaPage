import mongoose from 'mongoose';

const EmpresaSchema = new mongoose.Schema({
  nomeEmpresa: {
    type: String,
    required: true,
    unique: true
  },
  imgSRC: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Empresa || mongoose.model('Empresa', EmpresaSchema);