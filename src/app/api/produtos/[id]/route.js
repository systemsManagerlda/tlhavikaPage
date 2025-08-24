import { NextResponse } from 'next/server';
import { s3, PutObjectCommand, DeleteObjectCommand } from '../../../lib/aws-s3';
import Produto from '../../../models/Produto';
import dbConnect from '../../../lib/mongodb';


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

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const { data, files } = await parseMultipartFormData(request);
    const { name, price, description, technicalSpecs, category, stock, existingImages } = data;

    // Buscar produto existente
    const produtoExistente = await Produto.findById(id);
    if (!produtoExistente) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    const uploadedImages = [];

    // Processar novas imagens
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

    // Combinar imagens existentes com as novas
    let allImages = [...produtoExistente.gallery];
    
    if (existingImages) {
      try {
        const existingImagesArray = JSON.parse(existingImages);
        allImages = [...existingImagesArray, ...uploadedImages];
      } catch (error) {
        allImages = [...produtoExistente.gallery, ...uploadedImages];
      }
    } else {
      allImages = [...produtoExistente.gallery, ...uploadedImages];
    }

    // Parse da ficha técnica
    let parsedTechnicalSpecs = produtoExistente.technicalSpecs;
    if (technicalSpecs && technicalSpecs !== '{}') {
      try {
        parsedTechnicalSpecs = JSON.parse(technicalSpecs);
      } catch (parseError) {
        console.error('Erro no parse do JSON:', parseError);
      }
    }

    // Atualizar produto
    const produtoAtualizado = await Produto.findByIdAndUpdate(
      id,
      {
        name: name || produtoExistente.name,
        price: price ? parseFloat(price) : produtoExistente.price,
        description: description || produtoExistente.description,
        technicalSpecs: parsedTechnicalSpecs,
        category: category || produtoExistente.category,
        stock: stock ? parseInt(stock) : produtoExistente.stock,
        gallery: allImages
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      produto: produtoAtualizado
    });

  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar produto', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Excluir produto
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const produto = await Produto.findByIdAndDelete(id);
    
    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Opcional: Deletar imagens do S3 também
    // await deleteImagesFromS3(produto.gallery);

    return NextResponse.json({
      success: true,
      message: 'Produto excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir produto', details: error.message },
      { status: 500 }
    );
  }
}