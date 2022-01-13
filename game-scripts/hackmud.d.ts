/* eslint-disable @typescript-eslint/method-signature-style */

type DistributiveOmit<T, K extends keyof T> =
	T extends unknown
		? Omit<T, K>
		: never

type Replace<T, R> =
	DistributiveOmit<
		T,
		Extract<keyof R, keyof T>
	> & R

type MongoValue = string | number | boolean | Date | MongoValue[] | {
	[key: string]: MongoValue
} | null

type MongoCommandValue = string | number | boolean | Date | MongoCommandValue[] | {
	[key: string]: MongoCommandValue
} | null | undefined

type Id = string | number | boolean | Date | Record<string, MongoValue>

type Query = {
	[key: string]: MongoValue | Query
} & {
	_id?: Id
	$in?: MongoValue[]
}

type Projection = Record<string, boolean | 0 | 1>

type MongoDocument = {
	[key: string]: MongoValue
	_id: Id
}

type SortOrder = {
	[key: string]: 1 | -1 | SortOrder
}

type Cursor = {
	/**
	 * Returns the first document that satisfies the query.
	 */
	first(): MongoDocument | null

	/**
	 * Returns an array of documents that satisfy the query.
	 */
	array(): MongoDocument[]

	/**
	 * Returns the number of documents that match the query.
	 */
	count(): number

	/**
	 * Returns the first document that satisfies the query.
	 * Also makes cursor unusable.
	 */
	first_and_close(): MongoDocument

	/**
	 * Returns an array of documents that satisfy the query.
	 * Also makes cursor unusable.
	 */
	array_and_close(): MongoDocument[]

	/**
	 * Returns the number of documents that match the query.
	 * Also makes cursor unusable.
	 */
	count_and_close(): number

	/**
	 * Run callback on each document that satisfied the query.
	 *
	 * @param funct callback function
	 */
	each(funct: (document: MongoDocument) => void): null

	/**
	 * Returns a new cursor with documents sorted as specified.
	 * A value of 1 sorts the property ascending, and -1 descending.
	 *
	 * @param order the way the documents are to be sorted
	 */
	sort(order?: SortOrder): Cursor

	/**
	 * Returns a new cursor without the first number of documents.
	 *
	 * @param count number of documents to skip
	 */
	skip(count: number): Cursor

	/**
	 * Returns a new cursor limited to a number of documents as specified
	 *
	 * @param count number of documents
	 */
	limit(count: number): Cursor

	/**
	 * @param key they key of the documents
	 */
	distinct(key: string): MongoValue[]
	distinct(key: "_id"): Id[]

	/**
	 * Makes cursor unusable.
	 */
	close(): null

	NumberLong(number: number): number
	ObjectId(): any
}

type MongoCommand = MongoCommandValue & Partial<{
	$set: Record<string, MongoCommandValue>
	$push: Record<string, MongoCommandValue>
	$unset: Record<string, "">
}>

declare const $db: {
	/**
	 * Insert
	 *
	 * Inserts a document or documents into a collection.
	 * @param documents A document or array of documents to insert into the collection.
	 */
	i(documents: object | object[]): {
		ok: 1
		n: number

		opTime: {
			ts: "Undefined Conversion"
			t: number
		}

		electionId: "Undefined Conversion"
	}

	/**
	 * Remove
	 *
	 * Removes documents from a collection.
	 * @param query Specifies deletion criteria using query operators.
	 */
	r(query: Query): void

	/**
	 * Find
	 *
	 * Selects documents in a collection or view and returns a cursor to the selected documents.
	 * @param query Specifies deletion criteria using query operators.
	 * @param projection Specifies the fields to return in the documents that match the query filter.
	 */
	f(query?: Query, projection?: Projection): Cursor

	/**
	 * Update
	 *
	 * Modifies an existing document or documents in a collection.
	 * @param query Specifies deletion criteria using query operators.
	 * @param command The modifications to apply. {@link https://docs.mongodb.com/manual/reference/method/db.collection.update/#parameters}
	 */
	u(query: Query | Query[], command: MongoCommand): {
		ok: 0 | 1
		nModified: number
		n: number

		opTime: {
			ts: "Undefined Conversion"
			t: number
		}

		electionId: "Undefined Conversion"
	}

	/**
	 * Update 1
	 *
	 * Updates a single document within the collection based on the filter.
	 * @param query Specifies deletion criteria using query operators.
	 * @param command The modifications to apply. {@link https://docs.mongodb.com/manual/reference/method/db.collection.update/#parameters}
	 */
	u1(query: Query | Query[], command: MongoCommand): void

	/**
	 * Upsert
	 *
	 * Same as Update, but if no documents match the query, one document will be inserted based on the properties in both the query and the command.
	 * The `$setOnInsert` operator is useful to set defaults.
	 * @param query Specifies deletion criteria using query operators.
	 * @param command The modifications to apply. {@link https://docs.mongodb.com/manual/reference/method/db.collection.update/#parameters}
	 */
	us(query: Query | Query[], command: MongoCommand): void
}

type CLIContext = {
	/**
	 * The name of the user who is calling the script (i.e. n00b)
	 */
	caller: string

	/**
	 * The name of this script
	 */
	this_script: string

	/**
	 * the number of columns in the caller’s terminal, if reported by the client
	 */
	cols: number

	/**
	 * the number of rows in the caller’s terminal, if reported by the client
	 */
	rows: number

	/**
	 * The name of the script that directly called this script, or null if called on the command line or as a scriptor
	 */
	calling_script: null
}

type SubscriptContext = Replace<CLIContext, {
	/**
	 * The name of the script that directly called this script, or null if called on the command line or as a scriptor
	 */
	calling_script: string
}>

type ScriptorContext = CLIContext & {
	/**
	 * true if the script is being run as a scriptor, otherwise falsey (not present currently, but I wouldn’t rely on that)
	 */
	is_scriptor: true
}

type BrainContext = CLIContext & {
	/**
	 * true if the script is being run via a bot brain
	 */
	is_brain: true
}

type ScriptSuccess<T = Record<string, never>> = { ok: true } & T

type ScriptFailure = {
	ok: false
	msg?: string
}

type ScriptResponse<T = Record<string, never>> = ScriptSuccess<T> | ScriptFailure

declare const $fs = {
	chats: {
		/**
		 * **FULLSEC**
		 *
		 * @summary Send a chat message to a specific user
		 *
		 * @description This script lets you send a message to the specified user directly.
		 * You can message any user, you only need their username.
		 * Note that you will not be able to see your message after it is sent (though many chat scripts based on chats.tell also send the message to you to work around this limitation).
		 */
		tell(args: {
			/**
			 * The username to send the message to
			 */
			to: string

			/**
			 * The message to send
			 */
			msg: string
		}): ScriptResponse
	}
}

type Context = CLIContext | SubscriptContext | ScriptorContext | BrainContext

declare const context: Context

declare const args: unknown
