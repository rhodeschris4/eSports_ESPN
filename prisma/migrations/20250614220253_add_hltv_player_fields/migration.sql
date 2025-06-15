-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "hltvAchievements" JSONB,
ADD COLUMN     "hltvId" INTEGER,
ADD COLUMN     "hltvNews" JSONB,
ADD COLUMN     "hltvTeamId" INTEGER,
ADD COLUMN     "hltvTeamName" TEXT,
ADD COLUMN     "hltvTeams" JSONB,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "twitch" TEXT,
ADD COLUMN     "twitter" TEXT;
