const constant = require("../constants/constant");
const db = require("../models");
const queryDashboard = require("../lib/queries/dashboard");
const moment = require("moment");
const {
  createErrorResponse,
  createSuccessResponse,
} = require("../lib/response");

exports.saveScore = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const userId = event?.userId;
    const score = body?.score
    const date = moment().startOf("day");
    const start = date.valueOf();
    const end = moment(date).endOf("day").valueOf();

    if (score < 50 || score > 500 || isNaN(score)) {
      const errorMessage = `Score should be a numeric value between 50 and 500`;
      return createErrorResponse(
        constant.response_code.BAD_REQUEST,
        errorMessage
      );
    }

    const checkLimit = await db.sequelize.query(
      `SELECT COUNT(*) AS scoreCount FROM scoremaster WHERE userId = :userId AND createdAt BETWEEN :start AND :end`,
      {
        nest: true,
        mapToModel: true,
        replacements: {
          start,
          end,
          userId,
        },
      }
    );

    const scoreCount = checkLimit[0]?.scoreCount;

    if (scoreCount >= 3) {
      const errorMessage = `Maximum 3 scores can be added per day`;
      return createErrorResponse(
        constant.response_code.BAD_REQUEST,
        errorMessage
      );
    }

    await queryDashboard.createScore({ userId, score: body?.score });

    return createSuccessResponse("Score updated", null);
  } catch (err) {
    console.log(err);
    return createErrorResponse(
      constant.response_code.INTERNAL_SERVER_ERROR,
      err.message || constant.STRING_CONSTANTS.SOME_ERROR_OCCURED
    );
  }
};

exports.overAllScore = async (event) => {
  try {
    const userId = event?.userId;
    const data = await db.sequelize.query(
      `SELECT
            totalScore,
            userRank
        FROM (
            SELECT
                userId,
                SUM(score) AS totalScore,
                RANK() OVER (ORDER BY SUM(score) DESC) AS userRank
            FROM
                scoremaster 
            GROUP BY
                userId
        ) AS temp
        WHERE
            userId = :userId`,
      {
        nest: true,
        mapToModel: true,
        replacements: {
          userId,
        },
      }
    );

    if (!data.length) {
      const errorMessage = `No data found`;
      return createErrorResponse(
        constant.response_code.BAD_REQUEST,
        errorMessage
      );
    }
    return createSuccessResponse(null, data[0]);
  } catch (err) {
    console.log(err);
    return createErrorResponse(
      constant.response_code.INTERNAL_SERVER_ERROR,
      err.message || constant.STRING_CONSTANTS.SOME_ERROR_OCCURED
    );
  }
};

exports.weeklyScoreDashboard = async (event) => {
  try {
    const userId = event?.userId;

    const data = await db.sequelize.query(
      `SELECT
            json_arrayagg(
              json_object(
                "weekNo",
                weekNo,
                "totalScore",
                totalScore,
                "rank",
                userRank
              )
            ) as weeks
          FROM
            (
              SELECT
                weekNo,
                totalScore,
                userId,
                RANK() OVER (
                  PARTITION BY weekNo
                  ORDER BY
                    totalScore DESC
                ) AS userRank
              FROM
                (
                  SELECT
                    userId,
                    DATEDIFF(FROM_UNIXTIME(createdAt / 1000), '2024-03-01') DIV 7 + 1 AS weekNo,
                    SUM(score) AS totalScore
                  FROM
                    scoremaster
                  WHERE
                    createdAt > 1709231400000
                  GROUP BY
                    userId,
                    DATEDIFF(FROM_UNIXTIME(createdAt / 1000), '2024-03-01') DIV 7 + 1
                ) AS weeklyScores
            ) AS rankedScores
          WHERE
            userId = :userId
          ORDER BY
            weekNo ASC;`,
      {
        nest: true,
        mapToModel: true,
        replacements: {
          userId,
        },
      }
    );

    if (data?.length && !data[0].weeks) {
      const errorMessage = `No data found`;
      return createErrorResponse(
        constant.response_code.BAD_REQUEST,
        errorMessage
      );
    }

    return createSuccessResponse(null, data[0]);
  } catch (err) {
    console.log(err);
    return createErrorResponse(
      constant.response_code.INTERNAL_SERVER_ERROR,
      err.message || constant.STRING_CONSTANTS.SOME_ERROR_OCCURED
    );
  }
};
