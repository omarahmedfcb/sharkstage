import React from "react";
import styles from "./FeaturesSection.module.css";
import { FaCheckCircle } from "react-icons/fa";
import { Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function FeaturesSection() {
  return (
    <section className={`bg-soft ${styles["features-section"]}`}>
      <div className={styles["Investing"]}>
        <h2 className={styles["features-title"]}>
          Ready to <span>Start Investing?</span>
        </h2>

        <p className={styles["features-subtitle"]}>
          Join thousands of successful investors and entrepreneurs building
          wealth together
        </p>

        <div className={styles["features-container"]}>
          <div className={styles["feature-card"]}>
            <FaCheckCircle className={styles["feature-icon"]} />
            <p>Access to pre-vetted investment opportunities</p>
          </div>

          <div className={styles["feature-card"]}>
            <FaCheckCircle className={styles["feature-icon"]} />
            <p>Transparent pricing and detailed project analytics</p>
          </div>

          <div className={styles["feature-card"]}>
            <FaCheckCircle className={styles["feature-icon"]} />
            <p>Secure escrow services for all transactions</p>
          </div>

          <div className={styles["feature-card"]}>
            <FaCheckCircle className={styles["feature-icon"]} />
            <p>24/7 support from investment advisors</p>
          </div>
        </div>

        <div className={styles["features-buttons"]}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "8px",
              px: 4,
              py: 1,
              color: "#e6eaeeff",
              background: "linear-gradient(90deg, #2e59eb, #602aeb)",
              gap: 2,
              fontWeight: "500",
              "&:hover": { backgroundColor: "#1976d2", color: "white" },
            }}
          >
            Create Free Account <ArrowForwardIosIcon />
          </Button>

          <Button
            variant="contained"
            sx={{
              borderRadius: "8px",
              px: 4,
              py: 1,
              fontWeight: "500",
              color: "#0f1729",
              backgroundColor: "#f0f0f7ff",
              borderColor: "#1976d2",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Schedule a Demo
          </Button>
        </div>

        <p className={styles["features-subtext"]}>
          No credit card required • Free 30-day trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
