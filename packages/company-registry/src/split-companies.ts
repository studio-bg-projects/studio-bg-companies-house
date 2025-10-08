import dotenv from 'dotenv';

dotenv.config();

class SplitCompanies {
  async doit() {
    console.log('daaa');
  }
}

(async () => {
  const splitter = new SplitCompanies();

  await splitter.doit();
})();
