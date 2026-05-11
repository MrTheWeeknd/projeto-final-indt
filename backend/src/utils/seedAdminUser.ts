import { appDataSource } from "../database/appDataSource.js";
import { Usuario } from "../entities/Usuario.js";
import { hashPassword } from "./security.js";

export async function seedAdminUser(): Promise<void> {
  try {
    const usuarioRepository = appDataSource.getRepository(Usuario);

    const adminExists = await usuarioRepository.findOne({
      where: { email: "admin@indt.com" },
    });

    if (adminExists) {
      console.log("✓ Usuário admin já existe");
      return;
    }

    const senhaHash = await hashPassword("Admin@123");
    
    const novoAdmin = usuarioRepository.create({
      email: "admin@indt.com",
      senha: senhaHash,
      role: "admin",
    });

    await usuarioRepository.save(novoAdmin);
    console.log("✓ Usuário admin criado com sucesso!");
    console.log("  📧 Email: admin@indt.com");
    console.log("  🔐 Senha: Admin@123");
  } catch (error) {
    console.error("❌ Erro ao criar usuário admin:", error);
  }
}
