# How to generate typeorm migration files

1. Make sure that the `migration.config.ts` is configued properly. Note the initial configuration of the file, and update accordingly.

2. To do migration on the production DB, make sure that you are connected to the VPN.

3. Run `npm run migration:generate src/shared/database/migration/crawling/<migration file name>` to create the migration file.

4. Updated the newly created file, and make sure that only the changes that you want to apply in the DB is within the migration file. Remove everything else.

5. Run the script to apply the migration to the DB using `npm run migration:run`