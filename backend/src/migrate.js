import { runMigrations, getMigrationStatus, getDatabaseSummary } from './db/migrate.js';
import { setupDatabase } from './db/setup.js';

const args = new Set(process.argv.slice(2));
const withSeed = args.has('--seed');
const statusOnly = args.has('--status');

async function main() {
  if (statusOnly) {
    const status = await getMigrationStatus();
    const summary = await getDatabaseSummary();

    console.log(`\nBanco: ${status.target}`);
    console.log(`Migrations aplicadas: ${status.applied.join(', ') || '(nenhuma)'}`);
    console.log(`Migrations pendentes: ${status.pending.join(', ') || '(nenhuma)'}`);
    console.log(
      `Dados: ${summary.phases} fases, ${summary.lessons} aulas, ${summary.videos} vídeos, ${summary.users} usuários\n`
    );
    return;
  }

  if (withSeed) {
    console.log('🚀 Executando migrations + seed...');
    await setupDatabase();
  } else {
    console.log('🚀 Executando migrations...');
    await runMigrations();
  }

  const summary = await getDatabaseSummary();
  console.log(
    `\n📊 Estado do banco: ${summary.phases} fases, ${summary.lessons} aulas, ${summary.videos} vídeos, ${summary.users} usuários`
  );

  if (withSeed) {
    console.log('✅ Setup concluído (migrations + seed idempotente)');
  } else {
    console.log('✅ Migrations concluídas');
    console.log('💡 Para popular fases/aulas/vídeos/admin, rode: npm run db:setup');
  }
}

main().catch((err) => {
  console.error('❌ Falha:', err.message);
  process.exit(1);
});
