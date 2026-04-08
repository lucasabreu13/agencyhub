import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Agency, AgencyPlan, AgencyStatus } from '../entities/agency.entity';
import { User, UserRole } from '../entities/user.entity';
import { Client, ClientStatus } from '../entities/client.entity';
import { Campaign, CampaignStatus } from '../entities/campaign.entity';
import { Goal, GoalScope, GoalStatus } from '../entities/goal.entity';
import { Reminder } from '../entities/reminder.entity';
import { FinancialTransaction, TransactionType, TransactionScope } from '../entities/financial-transaction.entity';
import { Ticket, TicketType, TicketPriority, TicketStatus } from '../entities/ticket.entity';
import { CrmContact, CrmStage } from '../entities/crm-contact.entity';
import { KanbanTask, KanbanColumn, TaskPriority } from '../entities/kanban-task.entity';

export async function seed(dataSource: DataSource) {
  console.log('🌱 Iniciando seed...');

  const hash = (p: string) => bcrypt.hash(p, 10);

  // =============================================
  // ADMIN
  // =============================================
  const adminRepo = dataSource.getRepository(User);
  const existingAdmin = await adminRepo.findOne({ where: { email: 'admin@agencyhub.com' } });

  let admin: User;
  if (!existingAdmin) {
    // Usa query direta para evitar hooks @BeforeInsert/@BeforeUpdate da entidade
    await dataSource.query(
      `INSERT INTO users (id, name, email, password_hash, role, is_active, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())`,
      ['Admin AgencyHub', 'admin@agencyhub.com', await hash('Admin@123'), UserRole.ADMIN, true],
    );
    admin = await adminRepo.findOne({ where: { email: 'admin@agencyhub.com' } });
    console.log('  ✅ Admin criado: admin@agencyhub.com / Admin@123');
  } else {
    admin = existingAdmin;
    // Verifica se a senha está válida; corrige se estava corrompida por re-hash
    const isValid = await bcrypt.compare('Admin@123', existingAdmin.passwordHash);
    if (!isValid) {
      await dataSource.query(
        `UPDATE users SET password_hash = $1 WHERE email = $2`,
        [await hash('Admin@123'), 'admin@agencyhub.com'],
      );
      console.log('  🔧 Senha do admin estava corrompida — corrigida');
    } else {
      console.log('  ℹ️  Admin já existe');
    }
  }

  // =============================================
  // AGÊNCIA 1 — Pixel Agency
  // =============================================
  const agencyRepo = dataSource.getRepository(Agency);
  let agency1 = await agencyRepo.findOne({ where: { name: 'Pixel Agency' } });

  if (!agency1) {
    // Criar owner primeiro
    const owner1 = adminRepo.create({
      name: 'Mariana Costa',
      email: 'mariana@pixelagency.com.br',
      passwordHash: await hash('Owner@123'),
      role: UserRole.AGENCY_OWNER,
      isActive: true,
    });

    agency1 = agencyRepo.create({
      name: 'Pixel Agency',
      plan: AgencyPlan.PRO,
      status: AgencyStatus.ACTIVE,
    });
    await agencyRepo.save(agency1);

    owner1.agencyId = agency1.id;
    await adminRepo.save(owner1);

    agency1.ownerId = owner1.id;
    await agencyRepo.save(agency1);

    console.log('  ✅ Agência 1: Pixel Agency | mariana@pixelagency.com.br / Owner@123');

    // =============================================
    // CLIENTES DA PIXEL AGENCY
    // =============================================
    const clientRepo = dataSource.getRepository(Client);

    const clientUser1 = adminRepo.create({
      name: 'Pedro Alves',
      email: 'pedro@techstart.com.br',
      passwordHash: await hash('Cliente@123'),
      role: UserRole.AGENCY_CLIENT,
      agencyId: agency1.id,
      isActive: true,
    });
    await adminRepo.save(clientUser1);

    const client1 = clientRepo.create({
      agencyId: agency1.id,
      userId: clientUser1.id,
      name: 'TechStart LTDA',
      email: 'contato@techstart.com.br',
      company: 'TechStart',
      phone: '(11) 99999-1111',
      monthlyBudget: 8500,
      status: ClientStatus.ACTIVE,
      startDate: new Date('2025-06-01'),
    });
    await clientRepo.save(client1);

    const client2 = clientRepo.create({
      agencyId: agency1.id,
      name: 'Bella Modas',
      email: 'contato@bellamodas.com.br',
      company: 'Bella Modas',
      phone: '(11) 88888-2222',
      monthlyBudget: 4200,
      status: ClientStatus.ACTIVE,
      startDate: new Date('2025-09-01'),
    });
    await clientRepo.save(client2);

    const client3 = clientRepo.create({
      agencyId: agency1.id,
      name: 'Dr. Marcos Clínica',
      email: 'clinica@drmarcosestetica.com.br',
      company: 'Clínica Estética Dr. Marcos',
      phone: '(11) 77777-3333',
      monthlyBudget: 3000,
      status: ClientStatus.PAUSED,
      startDate: new Date('2024-12-01'),
    });
    await clientRepo.save(client3);

    console.log('  ✅ 3 clientes criados');

    // =============================================
    // CAMPANHAS
    // =============================================
    const campaignRepo = dataSource.getRepository(Campaign);

    await campaignRepo.save([
      campaignRepo.create({
        agencyId: agency1.id,
        clientId: client1.id,
        name: 'Google Ads — Software B2B Q1 2026',
        platform: 'Google Ads',
        status: CampaignStatus.ACTIVE,
        objective: 'Geração de leads qualificados',
        budget: 5000,
        spent: 2340,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-03-31'),
        kpi: 'CPL',
        kpiValue: 80,
        metrics: { impressions: 142000, clicks: 4260, ctr: 3.0, conversions: 87 },
      }),
      campaignRepo.create({
        agencyId: agency1.id,
        clientId: client1.id,
        name: 'LinkedIn Ads — Awareness Corporativo',
        platform: 'LinkedIn Ads',
        status: CampaignStatus.ACTIVE,
        objective: 'Brand awareness',
        budget: 3000,
        spent: 890,
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-04-30'),
        metrics: { impressions: 58000, clicks: 1200, ctr: 2.07, conversions: 12 },
      }),
      campaignRepo.create({
        agencyId: agency1.id,
        clientId: client2.id,
        name: 'Meta Ads — Coleção Outono 2026',
        platform: 'Meta Ads',
        status: CampaignStatus.ACTIVE,
        objective: 'Vendas diretas',
        budget: 2500,
        spent: 1820,
        startDate: new Date('2026-02-15'),
        endDate: new Date('2026-05-15'),
        kpi: 'ROAS',
        kpiValue: 4.5,
        metrics: { impressions: 310000, clicks: 9800, ctr: 3.16, conversions: 234 },
      }),
    ]);

    console.log('  ✅ Campanhas criadas');

    // =============================================
    // METAS DA AGÊNCIA
    // =============================================
    const goalRepo = dataSource.getRepository(Goal);
    await goalRepo.save([
      goalRepo.create({
        agencyId: agency1.id,
        createdBy: owner1.id,
        scope: GoalScope.AGENCY,
        title: 'Faturamento Q1 2026',
        description: 'Atingir R$ 50.000 de faturamento no primeiro trimestre',
        targetValue: 50000,
        currentValue: 34200,
        unit: 'R$',
        deadline: new Date('2026-03-31'),
        status: GoalStatus.ON_TRACK,
      }),
      goalRepo.create({
        agencyId: agency1.id,
        createdBy: owner1.id,
        scope: GoalScope.AGENCY,
        title: 'Novos Clientes Q1 2026',
        description: 'Fechar 3 novos contratos',
        targetValue: 3,
        currentValue: 1,
        unit: 'clientes',
        deadline: new Date('2026-03-31'),
        status: GoalStatus.AT_RISK,
      }),
    ]);

    // =============================================
    // LEMBRETES
    // =============================================
    const reminderRepo = dataSource.getRepository(Reminder);
    const today = new Date();
    await reminderRepo.save([
      reminderRepo.create({
        agencyId: agency1.id,
        userId: owner1.id,
        title: 'Enviar relatório mensal — TechStart',
        description: 'Relatório de fevereiro 2026',
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
        isDone: false,
      }),
      reminderRepo.create({
        agencyId: agency1.id,
        userId: owner1.id,
        title: 'Reunião de alinhamento — Bella Modas',
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
        isDone: false,
      }),
      reminderRepo.create({
        agencyId: agency1.id,
        userId: owner1.id,
        title: 'Renovar contrato — Dr. Marcos',
        description: 'Verificar interesse em retomar serviços',
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
        isDone: true,
        doneAt: new Date(),
      }),
    ]);

    // =============================================
    // TRANSAÇÕES FINANCEIRAS
    // =============================================
    const txRepo = dataSource.getRepository(FinancialTransaction);
    await txRepo.save([
      txRepo.create({
        agencyId: agency1.id,
        createdBy: owner1.id,
        clientId: client1.id,
        scope: TransactionScope.AGENCY,
        type: TransactionType.INCOME,
        amount: 8500,
        description: 'Mensalidade Março — TechStart',
        category: 'Mensalidade',
        date: new Date('2026-03-01'),
      }),
      txRepo.create({
        agencyId: agency1.id,
        createdBy: owner1.id,
        clientId: client2.id,
        scope: TransactionScope.AGENCY,
        type: TransactionType.INCOME,
        amount: 4200,
        description: 'Mensalidade Março — Bella Modas',
        category: 'Mensalidade',
        date: new Date('2026-03-05'),
      }),
      txRepo.create({
        agencyId: agency1.id,
        createdBy: owner1.id,
        scope: TransactionScope.AGENCY,
        type: TransactionType.EXPENSE,
        amount: 1200,
        description: 'Ferramentas SaaS (RD Station, Semrush)',
        category: 'Ferramentas',
        date: new Date('2026-03-01'),
      }),
    ]);

    // =============================================
    // CRM CONTACTS
    // =============================================
    const crmRepo = dataSource.getRepository(CrmContact);
    await crmRepo.save([
      crmRepo.create({
        agencyId: agency1.id,
        name: 'Juliana Ferreira',
        email: 'juliana@ecommercexyz.com.br',
        company: 'E-commerce XYZ',
        stage: CrmStage.PROPOSAL,
        dealValue: 5500,
        lastContact: new Date('2026-03-05'),
        notes: 'Interesse em gestão completa de Meta + Google',
      }),
      crmRepo.create({
        agencyId: agency1.id,
        name: 'Roberto Lima',
        email: 'roberto@construtora.com',
        company: 'Construtora Lima',
        stage: CrmStage.LEAD,
        dealValue: 3000,
        lastContact: new Date('2026-03-08'),
      }),
      crmRepo.create({
        agencyId: agency1.id,
        name: 'Ana Paula Souza',
        email: 'ana@clinicasouza.com.br',
        company: 'Clínica Souza',
        stage: CrmStage.NEGOTIATION,
        dealValue: 4800,
        lastContact: new Date('2026-03-07'),
        notes: 'Aguardando aprovação da proposta revisada',
      }),
    ]);

    // =============================================
    // KANBAN TASKS
    // =============================================
    const kanbanRepo = dataSource.getRepository(KanbanTask);
    await kanbanRepo.save([
      kanbanRepo.create({
        agencyId: agency1.id,
        clientId: client1.id,
        title: 'Criar criativos para campanha Google Q2',
        column: KanbanColumn.TODO,
        priority: TaskPriority.HIGH,
        position: 0,
        dueDate: new Date('2026-03-20'),
      }),
      kanbanRepo.create({
        agencyId: agency1.id,
        clientId: client1.id,
        title: 'Análise de keywords — Blog TechStart',
        column: KanbanColumn.DOING,
        priority: TaskPriority.MEDIUM,
        position: 0,
        dueDate: new Date('2026-03-15'),
      }),
      kanbanRepo.create({
        agencyId: agency1.id,
        clientId: client2.id,
        title: 'Relatório mensal Bella Modas — Fevereiro',
        column: KanbanColumn.REVIEW,
        priority: TaskPriority.HIGH,
        position: 0,
        dueDate: new Date('2026-03-10'),
      }),
      kanbanRepo.create({
        agencyId: agency1.id,
        title: 'Onboarding — novo cliente (E-commerce XYZ)',
        column: KanbanColumn.BACKLOG,
        priority: TaskPriority.LOW,
        position: 0,
      }),
    ]);

    // =============================================
    // TICKETS
    // =============================================
    const ticketRepo = dataSource.getRepository(Ticket);
    await ticketRepo.save([
      ticketRepo.create({
        agencyId: agency1.id,
        clientId: client1.id,
        createdBy: clientUser1.id,
        title: 'Por que o CTR caiu em fevereiro?',
        description: 'Notei que o CTR no Google Ads caiu de 3.5% para 2.8% em fevereiro. Podem verificar?',
        type: TicketType.CAMPAIGN,
        priority: TicketPriority.MEDIUM,
        status: TicketStatus.IN_PROGRESS,
        slaHours: 24,
      }),
    ]);

    console.log('  ✅ Dados operacionais criados (metas, CRM, kanban, tickets...)');
  } else {
    console.log('  ℹ️  Pixel Agency já existe, pulando seed');
  }

  // =============================================
  // ADMIN — Metas e Receitas da plataforma
  // =============================================
  const goalRepo = dataSource.getRepository(Goal);
  const platformGoalExists = await goalRepo.findOne({
    where: { createdBy: admin.id, scope: GoalScope.PLATFORM },
  });

  if (!platformGoalExists) {
    await goalRepo.save(
      goalRepo.create({
        createdBy: admin.id,
        scope: GoalScope.PLATFORM,
        title: 'Atingir 20 agências ativas em 2026',
        targetValue: 20,
        currentValue: 1,
        unit: 'agências',
        deadline: new Date('2026-12-31'),
        status: GoalStatus.ON_TRACK,
      }),
    );

    const txRepo = dataSource.getRepository(FinancialTransaction);
    await txRepo.save([
      txRepo.create({
        createdBy: admin.id,
        scope: TransactionScope.PLATFORM,
        type: TransactionType.INCOME,
        amount: 399,
        description: 'Assinatura Pro — Pixel Agency — Março',
        category: 'Assinatura',
        date: new Date('2026-03-01'),
      }),
    ]);

    console.log('  ✅ Dados da plataforma criados');
  }

  console.log('\n🎉 Seed concluído!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Admin:    admin@agencyhub.com  / Admin@123');
  console.log('  Owner:    mariana@pixelagency.com.br / Owner@123');
  console.log('  Cliente:  pedro@techstart.com.br / Cliente@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
