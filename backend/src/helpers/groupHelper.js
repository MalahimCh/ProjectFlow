// src/modules/group/group.helpers.js

import Group from "../database/models/group.model.js";
import GroupMember from "../database/models/groupMember.model.js";

/**
 * Check whether a student belongs to a group and whether that group is completed.
 *
 * A group is considered "completed" when Group.status === "completed".
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<{
 *   isInGroup: boolean,
 *   isGroupCompleted: boolean,
 *   membership: import("mongoose").Document | null,
 *   group: import("mongoose").Document | null
 * }>}
 */
export async function getUserGroupStatus(userId) {
  // Find membership and populate the linked group
  const membership = await GroupMember.findOne({ student: userId })
    .populate("group");

  // User is not part of any group
  if (!membership || !membership.group) {
    return {
      isInGroup: false,
      isGroupCompleted: false,
      membership: null,
      group: null,
    };
  }

  const group = membership.group;

  return {
    isInGroup: true,
    isGroupCompleted: group.status === "completed",
    membership,
    group,
  };
}