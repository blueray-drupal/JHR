import React, { useEffect, useState } from "react";
import PageLayout from "../../layout/page_layout/PageLayout";
import { parseDrupalMultipleNodes } from "../../utils/drupalParser";
import "./Faq.css";

function Faq() {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${baseUrl}/jsonapi/node/faq`);

                if (!response.ok) {
                    console.log(response.status);
                }

                const data = await response.json();
                setQuestions(parseDrupalMultipleNodes(data, baseUrl));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [baseUrl]);

    const breadcrumb = [
        { title: "الرئيسية", link: "/" },
        { title: "الأسئلة الأكثر تكراراً", link: null },
    ];

    return (
        <PageLayout
            pageTitle="الأسئلة الأكثر تكراراً"
            breadcrumb={breadcrumb}
            isLoading={loading}
            loadingType="faq"
        >
            <div className="faq-container">
                {questions.map((question) => (
                    <section key={question.id} className="faq-item">
                        <h2 className="faq-question">{question.title}</h2>
                        <ul className="faq-answers">
                            {(question.field_multiple_body || []).map((answer, index) => (
                                <li key={index} className="faq-answer">{answer}</li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </PageLayout>
    );
}

export default Faq;
