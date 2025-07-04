import cron from "node-cron";
import { userService } from "../services/userService";

cron.schedule("0 0 1 * *", async () => {
  try {
    await userService.resetUsersAllTrials();
    console.log("Monthly trials reset completed successfully.");
  } catch (error) {
    console.error("Error resetting monthly trials:", error);
  }
});