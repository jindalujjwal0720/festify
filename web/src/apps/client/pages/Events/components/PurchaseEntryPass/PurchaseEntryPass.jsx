import { useState } from "react";
import styles from "./PurchaseEntryPass.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../../state/redux/auth/authSlice";
import Button from "../../../../atoms/Button";
import Modal from "../../../../components/Modal/Modal";
import { usePurchaseEntryPassMutation } from "../../../../../../state/redux/entryPass/entryPassApi";
import PaymentService from "../../../../../../services/payment";
import { toast } from "../../../../components/Toast";
import ApplyPromoCode from "../../../../components/ApplyPromoCode/ApplyPromoCode";

const PurchaseEntryPass = ({ event = {}, close }) => {
  const user = useSelector(selectUser);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [purchaseEntryPass, { isLoading }] = usePurchaseEntryPassMutation();

  const handleChange = (e) => {
    setPromoCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { type, order } = await purchaseEntryPass({
        eventId: event._id,
        promoCode,
      }).unwrap();
      if (type === "entry-pass") {
        toast.success("Entry pass purchased successfully");
        close();
      }
      if (type === "order" && order) {
        close();
        await PaymentService.displayPaymentPopup({
          user,
          order,
          description: `Entry pass for ${event.name}`,
        });
      }
    } catch (err) {
      setError(err.data?.message);
      toast.error(
        err.data?.message ||
          err.error?.message ||
          "Unable to purchase entry pass"
      );
    }
  };

  if (!event || !user) {
    return (
      <Modal
        title={!event ? "Event not found" : "Login to register"}
        close={close}
      />
    );
  }

  return (
    <Modal title={event.name} close={close}>
      <div className={styles.details}>
        <div className={styles.item}>
          <p className={styles.key}>Name</p>
          <p className={styles.value}>{user.name}</p>
        </div>
        <div className={styles.item}>
          <p className={styles.key}>Contact Email</p>
          <p className={styles.value}>{user.email}</p>
        </div>
        <div className={styles.item + " " + styles.price}>
          <p className={styles.key}>Price</p>
          <p className={styles.value}>
            {event.entryPassPriceInINR > 0
              ? `₹ ${event.entryPassPriceInINR}`
              : "Free"}
          </p>
        </div>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        {event.entryPassPriceInINR > 0 && (
          // <div className={styles.formGroup}>
          //   <label htmlFor="promoCode">Promo Code</label>
          //   <div className="flex justify-between gap-2">
          //     <input
          //       type="text"
          //       name="promoCode"
          //       id="promoCode"
          //       className={styles.input + " flex-1"}
          //       value={promoCode}
          //       onChange={handleChange}
          //     />
          //     <Button variant="outline-secondary" className="!max-w-24">
          //       Apply
          //     </Button>
          //   </div>
          // </div>
          <ApplyPromoCode onChange={handleChange} defaultValue={promoCode} />
        )}
        {error && <p className={styles.error}>{error}</p>}
        <Button variant="secondary" type="submit" className={styles.submit}>
          {event.entryPassPriceInINR > 0 ? "Pay and Get Pass" : "Get Pass"}
        </Button>
      </form>
    </Modal>
  );
};

export default PurchaseEntryPass;
