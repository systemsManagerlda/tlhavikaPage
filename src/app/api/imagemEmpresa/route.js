import { NextResponse } from 'next/server';
import upload from '../../lib/multer';
import { s3, PutObjectCommand } from '../../lib/aws-s3';
import Empresa from '../../models/Empresa';
import mongoose from 'mongoose';

// Configuração do multer para Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export async function PATCH(req) {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    // Criar um objeto de resposta compatível com multer
    const res = {
      status: (code) => ({
        json: (data) => NextResponse.json(data, { status: code }),
      }),
    };

    // Executar middleware multer
    await runMiddleware(req, res, upload.single('image'));

    const file = req.file;
    const formData = await req.formData();
    const nomeEmpresa = formData.get('nomeEmpresa');

    if (!file) {
      return NextResponse.json(
        { message: 'Nenhuma imagem enviada' },
        { status: 400 }
      );
    }

    if (!nomeEmpresa) {
      return NextResponse.json(
        { message: 'Nome da empresa é obrigatório' },
        { status: 400 }
      );
    }

    const ext = file.originalname.split('.').pop();
    const newFilename = `empresa_${Date.now()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: newFilename,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    const link = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${newFilename}`;

    const empresaAtualizada = await Empresa.findOneAndUpdate(
      { nomeEmpresa: nomeEmpresa },
      { $set: { imgSRC: link } },
      { new: true, upsert: true }
    );

    return NextResponse.json(empresaAtualizada);

  } catch (error) {
    console.error('Erro ao atualizar imagem da empresa:', error);
    return NextResponse.json(
      { error: 'Erro ao editar imagem da empresa', details: error.message },
      { status: 500 }
    );
  }
}