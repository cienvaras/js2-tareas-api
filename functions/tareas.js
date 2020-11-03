require('dotenv').config();
const fetch = require('node-fetch');

const GET_ALL_TASKS = `
  query {
    allTasks(_size: 99999) {
      data {
        _id
        userId
        name
        complete
        date
      }
    }
  }
`;

const CREATE_TASK = `
  mutation ($name: String!, $complete: Boolean!, $date: String!, $userId: Int!) {
    createTask(data: {
      userId: $userId
      name: $name
      complete: $complete
      date: $date
    }) {
      _id
      name
      complete
      date
    }
  }
`;

const UPDATE_TASK = `
  mutation ($id: ID!, $name: String!, $complete: Boolean!, $date: String!, $userId: Int!) {
    updateTask(id: $id, data: {
      userId: $userId
      name: $name
      complete: $complete
      date: $date
    }) {
      _id
      name
      complete
      date
    }
  }
`;

const DELETE_TASK = `
  mutation ($id: ID!) {
    deleteTask(id: $id) {
      _id
    }
  }
`;

async function sendQuery(query, variables) {
  const response = await fetch(
    'https://graphql.fauna.com/graphql',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.FAUNA_SERVER_SECRET}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  );
  const data = await response.json();
  return data;
}

async function getAllTasks(uid) {
  const { data } = await sendQuery(GET_ALL_TASKS);
  const tasks = data.allTasks.data.filter(task => task.userId === uid);
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*', 
    },
    body: JSON.stringify(tasks),
  };
}

async function createTask(uid, taskData) {
  const { data } = await sendQuery(CREATE_TASK, {
    userId: uid,
    ...taskData,
  });
  return {
    statusCode: 201,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*', 
    },
    body: JSON.stringify(data.createTask),
  };
}

async function updateTask(uid, taskId, taskData) {
  const { data } = await sendQuery(UPDATE_TASK, {
    id: taskId,
    userId: uid,
    ...taskData,
  });
  if (!data.updateTask) {
    return {
      statusCode: 404,
      headers: {
        'content-type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
      body: 'NOT FOUND',
    };
  }
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(data.updateTask),
  };
}

async function deleteTask(taskId) {
  const { data } = await sendQuery(DELETE_TASK, {
    id: taskId,
  });
  if (!data.deleteTask) {
    return {
      statusCode: 404,
      headers: {
        'content-type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
      body: 'NOT FOUND',
    };
  }
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(data.deleteTask),
  };
}

exports.handler = async (event, context, callback) => {
  const uid = parseInt(event.queryStringParameters.uid);
  if (!uid && event.httpMethod !== 'OPTIONS') {
    return {
      statusCode: 403,
      body: 'ACCESS DENIED',
    };
  }
  const routeParam = event.path.match(/\/api\/tareas\/(.+)/);
  switch (event.httpMethod) {
    case 'OPTIONS':
      return {
        statusCode: 204,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT',
        },
        body: JSON.stringify({}),
      };
    case 'GET':
      return await getAllTasks(uid);
    case 'POST':
      return await createTask(uid, JSON.parse(event.body));
    case 'PUT':
      if (routeParam) {
        return await updateTask(uid, routeParam[1], JSON.parse(event.body));
      } else {
        return {
          statusCode: 400,
          body: 'BAD REQUEST',
        };
      }
    case 'DELETE':
      if (routeParam) {
        return await deleteTask(routeParam[1]);
      } else {
        return {
          statusCode: 400,
          body: 'BAD REQUEST',
        };
      }
  }
};
