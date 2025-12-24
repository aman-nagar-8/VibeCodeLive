import { motion } from "framer-motion";
import { MdDone } from "react-icons/md";
import { BiSolidCheckbox } from "react-icons/bi";

export function StepCircle({ status }) {
  return (
    <motion.div
      layout
      initial={false}
      animate={{
        backgroundColor:
          status === "done"
            ? "#17b8a8"
            : status === "running"
            ? "#17b8a8"
            : "#ffffff",
        borderColor:
          status === "running"
            ? "#17b8a8"
            : status === "done"
            ? "#17b8a8"
            : "#e4e4e7",
        scale: status === "running" ? 1.1 : 1,
      }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-5 h-5 rounded-md border flex items-center justify-center"
    >
      {status === "done"&& (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <MdDone className="text-white text-sm" />
        </motion.span>
      )}
      {status === "running"&& (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <BiSolidCheckbox className="text-white text-sm" />
        </motion.span>
      )}
      {status === "incomplete"&& (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <BiSolidCheckbox className="text-zinc-300 text-sm" />
        </motion.span>
      )}
    </motion.div>
  );
}
