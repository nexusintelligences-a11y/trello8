import { storage } from "./storage";

// Script para adicionar dados de exemplo no banco de dados
async function seed() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...");

    // Criar usuário de exemplo
    const user = await storage.createUser({
      username: "usuario_demo",
      password: "senha123", // Em produção, use bcrypt!
      email: "demo@example.com",
    });
    console.log("✅ Usuário criado:", user.username);

    // Criar quadro
    const board = await storage.createBoard({
      title: "Meu Quadro do Trello",
      description: "Quadro de exemplo com dados reais",
      ownerId: user.id,
    });
    console.log("✅ Quadro criado:", board.title);

    // Criar listas
    const list1 = await storage.createList({
      boardId: board.id,
      title: "A Fazer",
      position: 0,
    });

    const list2 = await storage.createList({
      boardId: board.id,
      title: "Em Progresso",
      position: 1,
    });

    const list3 = await storage.createList({
      boardId: board.id,
      title: "Concluído",
      position: 2,
    });
    console.log("✅ Listas criadas");

    // Criar labels para o quadro
    const labelUrgente = await storage.createLabel({
      boardId: board.id,
      name: "Urgente",
      color: "#ef4444",
    });

    const labelImportante = await storage.createLabel({
      boardId: board.id,
      name: "Importante",
      color: "#f59e0b",
    });

    const labelConcluido = await storage.createLabel({
      boardId: board.id,
      name: "Concluído",
      color: "#10b981",
    });
    console.log("✅ Labels criadas");

    // Criar cartões
    const card1 = await storage.createCard({
      listId: list1.id,
      title: "Configurar projeto",
      description: "Configurar ambiente de desenvolvimento",
      position: 0,
      createdBy: user.id,
    });

    const card2 = await storage.createCard({
      listId: list1.id,
      title: "Implementar autenticação",
      description: "Adicionar sistema de login e registro",
      position: 1,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      createdBy: user.id,
    });

    const card3 = await storage.createCard({
      listId: list2.id,
      title: "Desenvolver dashboard",
      description: "Criar interface do dashboard com gráficos",
      position: 0,
      createdBy: user.id,
    });

    const card4 = await storage.createCard({
      listId: list3.id,
      title: "Setup inicial",
      description: "Configuração inicial do projeto concluída",
      position: 0,
      createdBy: user.id,
    });
    console.log("✅ Cartões criados");

    // Adicionar labels aos cartões
    await storage.addCardLabel({ cardId: card2.id, labelId: labelUrgente.id });
    await storage.addCardLabel({ cardId: card2.id, labelId: labelImportante.id });
    await storage.addCardLabel({ cardId: card4.id, labelId: labelConcluido.id });
    console.log("✅ Labels adicionadas aos cartões");

    // Adicionar membro ao quadro
    await storage.addBoardMember({
      boardId: board.id,
      userId: user.id,
      role: "owner",
    });
    console.log("✅ Membro adicionado ao quadro");

    console.log("\n🎉 Seed concluído com sucesso!");
    console.log(`Board ID: ${board.id}`);
    console.log(`User ID: ${user.id}`);
    
    return { boardId: board.id, userId: user.id };
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    throw error;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log("✅ Processo de seed finalizado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Falha no seed:", error);
      process.exit(1);
    });
}

export { seed };
