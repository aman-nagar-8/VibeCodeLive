import { motion } from "framer-motion";

export function StepConnector({ active }) {
  return (
    <div className="mx-1 w-25 h-0.5 bg-zinc-200 overflow-hidden rounded-md">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: active ? "100%" : "0%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="h-full bg-[#17b8a8]"
      />
    </div>
  );
}
