export class MongoDbService {
    private mongoose = require('mongoose');
    private locationModel: any;

    async connect(): Promise<void> {
        await this.mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/availabilityPredictions');

        const schema = new this.mongoose.Schema(
            {
                ocpi: this.mongoose.Schema.Types.Mixed,
                location: this.mongoose.Schema.Types.Mixed,
                __t: String,
                peerID: String,
                countryCode: String,
                partyID: String,
                name: String,
                lastUpdated: String,
                createdAt: String,
                updatedAt: String,
                plugs: Array,
                powerLevels: Array,
                rank: String,
                locationID: String,
                operatorName: String,
                company: { type: Map },
                peer: { type: Map },
                id: String,
                powerLevel: Array,
            },
            { collection: 'locations' }
        );
        this.locationModel =
            this.mongoose.models.Locations ??
            this.mongoose.model('Locations', schema);
    }

    async storeLocations(locations: any[]): Promise<void> {
        await this.locationModel.insertMany(locations);
    }
}
