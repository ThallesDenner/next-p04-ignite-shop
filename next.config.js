/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // O Next não realiza a otimização das imagens para qualquer domínio, então aqui especificamos quais são os domínios das imagens que devem ser otimizadas
  images: {
    domains: ["files.stripe.com"],
  },
};

module.exports = nextConfig;
