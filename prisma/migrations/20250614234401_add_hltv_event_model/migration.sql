-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "dateStart" TIMESTAMP(3),
    "dateEnd" TIMESTAMP(3),
    "prizePool" TEXT,
    "locationName" TEXT,
    "locationCode" TEXT,
    "numberOfTeams" INTEGER,
    "teams" JSONB,
    "prizeDistribution" JSONB,
    "relatedEvents" JSONB,
    "formats" JSONB,
    "mapPool" JSONB,
    "highlights" JSONB,
    "news" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
