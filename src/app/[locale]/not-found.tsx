"use client"

export default function NotFound() {
    return (
        <>
            <div className="d-flex align-items-center justify-content-center" style={{ padding: '40px 0' }}>
                <div className="col-lg-6 mx-auto">
                    <img src="/images//not_found.svg" className="img-contain"  style={{ 
                        width: '40%',
                        display: "block",
                        margin: "0 auto",
                        objectFit: "contain", 
                        }}
                    />
                </div>
            </div>
        </>
    );
}
