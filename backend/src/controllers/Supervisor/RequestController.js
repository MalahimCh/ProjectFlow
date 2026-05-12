import SupervisorRequest from "../../database/models/supervisorRequest.model.js";
import Group from "../../database/models/group.model.js";

/* ─────────────────────────────────────────────
   2. GET ALL REQUESTS FOR SUPERVISOR
──────────────────────────────────────────── */
export const getSupervisorRequests = async (req, res) => {
  try {
    const supervisorId = req.user.id;

    const requests = await SupervisorRequest.find({
      supervisor: supervisorId,
    })
      .populate("group", "name status createdBy")
      .populate("supervisor", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching requests",
      error: error.message,
    });
  }
};

/* ─────────────────────────────────────────────
   3. ACCEPT REQUEST
──────────────────────────────────────────── */
export const acceptSupervisorRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await SupervisorRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.supervisor.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update request status
    request.status = "accepted";
    await request.save();

    // Assign supervisor to group
    const group = await Group.findById(request.group);
    group.supervisor = request.supervisor;
    group.status = "completed";
    await group.save();

    // Reject other pending requests for same group
    await SupervisorRequest.updateMany(
      {
        group: request.group,
        _id: { $ne: request.id },
        status: "pending",
      },
      { status: "rejected" },
    );

    return res.status(200).json({
      message: "Request accepted successfully",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error accepting request",
      error: error.message,
    });
  }
};

/* ─────────────────────────────────────────────
   4. REJECT REQUEST
──────────────────────────────────────────── */
export const rejectSupervisorRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await SupervisorRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.supervisor.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = "rejected";
    await request.save();

    return res.status(200).json({
      message: "Request rejected",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error rejecting request",
      error: error.message,
    });
  }
};
