// Enum for different types of donations
enum DonationType {
  Money = "Money",
  Food = "Food",
  Clothing = "Clothing",
}

// Donation class to represent each donation
class Donation {
  constructor(
    public donor: string,
    public donationType: DonationType,
    public quantity: number,
    public date: string
  ) {}
}

// Shelter class to manage donations
class Shelter {
  private donations: Donation[] = [];
  private distributions: Donation[] = [];

  // Register a new donation
  registerDonation(donor: string, donationType: DonationType, quantity: number, date: string) {
    const donation = new Donation(donor, donationType, quantity, date);
    this.donations.push(donation);
  }

  // Record a distribution of donations
  distributeDonation(donationType: DonationType, quantity: number, date: string) {
    const distribution = new Donation('Shelter', donationType, quantity, date);
    this.distributions.push(distribution);
    // Adjust inventory
    for (let donation of this.donations) {
      if (donation.donationType === donationType && donation.quantity >= quantity) {
        donation.quantity -= quantity;
        break;
      }
    }
  }

  // Generate an inventory report
  inventoryReport(): Record<string, number> {
    const report: Record<string, number> = {};
    this.donations.forEach(donation => {
      const type = donation.donationType;
      report[type] = (report[type] || 0) + donation.quantity;
    });
    return report;
  }

  // Generate a donator report
  donatorReport(): Record<string, {total: number, breakdown: Record<DonationType, number>}> {
    const report: Record<string, {total: number, breakdown: Record<DonationType, number>}> = {};
    this.donations.forEach(donation => {
      if (!report[donation.donor]) {
        report[donation.donor] = { total: 0, breakdown: {
          [DonationType.Money]: 0,
          [DonationType.Food]: 0,
          [DonationType.Clothing]: 0
        } };
      }
      report[donation.donor].total += donation.quantity;
      report[donation.donor].breakdown[donation.donationType] =
        (report[donation.donor].breakdown[donation.donationType] || 0) + donation.quantity;
    });
    return report;
  }
}

  
  // Example Usage
  const shelter = new Shelter();
  shelter.registerDonation("John Doe", DonationType.Clothing, 10, "2023-01-01");
  shelter.registerDonation("Yar", DonationType.Food, 10, "2022-01-01");  
  shelter.registerDonation("Yar", DonationType.Clothing, 10, "2022-01-01");
  shelter.distributeDonation(DonationType.Clothing, 2, "2023-01-02");
  console.log("Inventory Report:", shelter.inventoryReport());
  console.log("Donator Report:", shelter.donatorReport());
  