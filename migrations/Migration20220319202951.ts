import { Migration } from '@mikro-orm/migrations';
import { City } from '../src/cities/entities/city.entity';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

export class Migration20220319180058 extends Migration {
  async up(): Promise<void> {
    const entityManager = this.driver.createEntityManager(true);

    const parser = parse({
      delimiter: ',',
      from: 2, // Skip header
    })
      .on('readable', function () {
        let record;
        while ((record = this.read()) !== null) {
          const city = entityManager.create(City, {
            name: record[0],
            latitude: record[1],
            longitude: record[2],
            country: record[3],
          });
          entityManager.persist(city);
        }
      })
      .on('end', function () {
        entityManager.flush();
      });

    const readStream = fs.createReadStream(
      path.join(__dirname, 'Migration20220319202951-input.csv'),
    );
    readStream.pipe(parser);
  }

  async down(): Promise<void> {
    this.addSql('delete from city');
  }
}
