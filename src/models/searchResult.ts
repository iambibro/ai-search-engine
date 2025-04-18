import {
	pgTable,
	text,
	timestamp,
	uuid,
	vector,
	index,
} from "drizzle-orm/pg-core";

export const searchResult = pgTable(
	"SearchResult",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		url: text("url").notNull(),
		query: text("query").notNull(),
		webContent: text("webContent").notNull(),
		analysis: text("analysis").notNull(),
		contentVector: vector("contentVector", { dimensions: 768 }).notNull(),
		analysisVector: vector("analysisVector", { dimensions: 768 }).notNull(),
		createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
	},
	(table) => [
		index("content_vector_idx").using(
			"ivfflat",
			table.contentVector.op("vector_l2_ops")
		),
		index("analysis_vector_idx").using(
			"ivfflat",
			table.analysisVector.op("vector_l2_ops")
		),
	]
);
