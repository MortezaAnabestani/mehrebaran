import styles from "../styles/dashboardSkeleton.module.css"; // استایل‌های CSS Modules

const DashboardSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      {/* عنوان کمپین‌ها */}
      <div className={`${styles.skeletonTitle} ${styles.pulseAnimation}`} />

      {/* کارت‌های آماری */}
      <div className={styles.statsContainer}>
        {[...Array(4)].map((_, index) => (
          <div key={index} className={`${styles.statCard} ${styles.pulseAnimation}`} />
        ))}
      </div>

      {/* نمودار اصلی */}
      <div className={`${styles.chartPlaceholder} ${styles.pulseAnimation}`} />

      {/* لیست داده‌ها */}
      <div className={styles.dataList}>
        {[...Array(5)].map((_, index) => (
          <div key={index} className={styles.dataRow}>
            <div className={`${styles.dataCell} ${styles.pulseAnimation}`} />
            <div className={`${styles.dataCell} ${styles.pulseAnimation}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
