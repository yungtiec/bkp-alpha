const grantsObject = {
  admin: {
    user: {
      "read:own": ["*"],
      "update:own": ["*"],
      "update:any": ["!role", "!restricted_access"]
    },
    project: {
      "read:any": ["*"],
      "create:any": ["*"], // apoint project_admin
      "update:any": ["*"] // appoint editor for project
    },
    disclosure: {
      "read:any": ["*"],
      "create:any": ["*"],
      "update:any": ["*"] // appoint collaboraor for disclosure
    },
    comment: {
      "create:own": ["*"],
      "read:any": ["*"],
      "update:own": ["*"],
      "update:any": ["upvote", "issue", "verify"],
      "delete:own": ["*"]
    }
  },
  project_admin: {
    user: {
      "read:own": ["*"],
      "update:own": ["*", "!role", "!restricted_access"]
    },
    project: {
      "read:any": ["*"],
      "update:own": ["*"] // appoint editor for project
    },
    disclosure: {
      "read:any": ["*"],
      "create:any": ["*"],
      "update:own": ["*"] // appoint collaboraor for disclosure
    },
    comment: {
      "create:own": ["*"],
      "read:any": ["*"],
      "update:own": ["*"],
      "update:any": ["upvote", "issue", "verify"], // any comment in disclosures of own project
      "delete:own": ["*"]
    }
  },
  editor: {
    user: {
      "read:own": ["*"],
      "update:own": ["*", "!role", "!restricted_access"]
    },
    project: {
      "read:any": ["*"]
    },
    disclosure: {
      "read:any": ["*"],
      "create:any": ["*"], // within project???
      "update:own": ["*"] // appoint collaborator for disclosure
    },
    comment: {
      "create:own": ["*"],
      "read:any": ["*"],
      "update:own": ["*"],
      "update:any": ["upvote", "issue", "verify"], // any comment in own disclosure
      "delete:own": ["*"]
    }
  },
  user: {
    user: {
      "read:own": ["*"],
      "update:own": ["*", "!role", "!restricted_access"]
    },
    project: {
      "read:any": ["*"]
    },
    disclosure: {
      "read:any": ["*"]
    },
    comment: {
      "create:own": ["*"],
      "read:any": ["*"],
      "update:own": ["*", "!verify"],
      "update:any": ["upvote"],
      "delete:own": ["*"]
    }
  }
};

const AccessControl = require("accesscontrol");
const ac = new AccessControl(grantsObject);

module.exports = ac;
