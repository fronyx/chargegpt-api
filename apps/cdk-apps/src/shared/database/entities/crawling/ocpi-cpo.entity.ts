import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Cpo } from '../../../domain';

@Entity({ name: 'ocpi_cpo' })
export class OcpiCpoEntity {
  @PrimaryColumn({ type: 'varchar' })
  party_id: string;

  @Column({ nullable: true, type: 'varchar' })
  token: string;

  @Column({ nullable: true, type: 'varchar' })
  token_b: string;

  @Column({ nullable: true, type: 'varchar' })
  versions_url: string;

  @Column({ nullable: true, type: 'varchar' })
  credentials_url: string;

  @Column({ nullable: true, type: 'varchar' })
  locations_url: string;

  @Column({ type: 'varchar' })
  country_code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  website: string;

  @Column({ default: false, type: 'boolean' })
  is_sending_active: boolean;

  constructor(args: Partial<OcpiCpoEntity>) {
    Object.assign(this, args);
  }

  static toEntity(args: Cpo): OcpiCpoEntity {
    return new OcpiCpoEntity({
      party_id: args.party_id,
      token: args.token,
      token_b: args.token_b,
      versions_url: args.url,
      credentials_url: args.credentials_url,
      locations_url: args.locations_url,
      country_code: args.country_code,
      name: args.business_details.name,
      website: args.business_details.website,
    });
  }

  toDto(): Cpo {
    return new Cpo({
      party_id: this.party_id,
      token: this.token,
      token_b: this.token_b,
      url: this.versions_url,
      credentials_url: this.credentials_url,
      locations_url: this.locations_url,
      country_code: this.country_code,
      name: this.name,
      website: this.website,
    });
  }
}
