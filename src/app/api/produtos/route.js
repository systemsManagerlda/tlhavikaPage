import { NextResponse } from 'next/server';
import { s3, PutObjectCommand } from '../../lib/aws-s3';
import Produto from '../../models/Produto';
import dbConnect from '../../lib/mongodb';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseMultipartFormData(request) {
  const formData = await request.formData();
  const data = {};
  const files = [];

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      files.push({ key, file: value });
    } else {
      data[key] = value;
    }
  }

  return { data, files };
}

async function uploadImageToS3(file) {
  try {
    const ext = file.name.split('.').pop();
    const newFilename = `produto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: newFilename,
      Body: buffer,
      ContentType: file.type,
    });

    await s3.send(command);
    
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${newFilename}`;
  } catch (error) {
    console.error('Erro no upload para S3:', error);
    throw error;
  }
}

// GET - Listar todos os produtos
export async function GET() {
  try {
    await dbConnect();
    const produtos = await Produto.find().sort({ createdAt: -1 });
    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos', details: error.message },
      { status: 500 }
    );
  }
}


// POST - Criar novo produto
export async function POST(request) {
  try {
    await dbConnect();

    const { data, files } = await parseMultipartFormData(request);
    const { name, price, description, technicalSpecs, category, stock } = data;

    if (!name || !price || !category || !stock) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    // Processar upload das imagens
    for (const fileObj of files) {
      if (fileObj.key === 'gallery') {
        try {
          const imageUrl = await uploadImageToS3(fileObj.file);
          uploadedImages.push(imageUrl);
        } catch (error) {
          console.error('Erro no upload da imagem:', error);
        }
      }
    }

    // Parse da ficha técnica
    let parsedTechnicalSpecs = {};
    if (technicalSpecs && technicalSpecs !== '{}') {
      try {
        parsedTechnicalSpecs = JSON.parse(technicalSpecs);
      } catch (parseError) {
        console.error('Erro no parse do JSON:', parseError);
        // Não retornar erro, apenas usar objeto vazio
      }
    }

    // Criar novo produto
    const novoProduto = new Produto({
      name,
      price: parseFloat(price),
      description: description || '',
      technicalSpecs: parsedTechnicalSpecs,
      category,
      stock: parseInt(stock),
      gallery: uploadedImages
    });

    await novoProduto.save();

    return NextResponse.json(
      { 
        success: true, 
        message: 'Produto criado com sucesso', 
        produto: novoProduto 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar produto', details: error.message },
      { status: 500 }
    );
  }
}